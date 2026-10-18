/* Independent checks for the BAC explorer's pure calculation and URL model. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const appPath = path.resolve(__dirname, '../index.html');
const html = fs.readFileSync(appPath, 'utf8');
const modelScript = html.match(/<script\b[^>]*\bid=["']bac-model["'][^>]*>([\s\S]*?)<\/script>/i);
assert.ok(modelScript, 'The standalone file exposes its pure model in script#bac-model');
const context = { window: {}, URLSearchParams };
vm.runInNewContext(modelScript[1], context, { filename: 'bac-model.js' });
const model = context.window.BACModel;
assert.ok(model, 'window.BACModel exists');
const { estimate, servingStandardDrinks, normalizeState, stateToHash, stateFromHash, classify } = model;
for (const helper of [estimate, servingStandardDrinks, normalizeState, stateToHash, stateFromHash, classify]) {
  assert.equal(typeof helper, 'function');
}
const plain = value => JSON.parse(JSON.stringify(value));
const defaults = plain(model.defaults);
const near = (actual, expected, tolerance = 1e-12) => {
  assert.ok(Number.isFinite(actual), `Expected a finite value; got ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
};
let passed = 0;
function test(label, check) {
  try { check(); passed += 1; process.stdout.write(`PASS ${label}\n`); }
  catch (error) { error.message = `${label}: ${error.message}`; throw error; }
}

test('independent published-unit numeric anchors', () => {
  near(model.LB_TO_KG, 0.45359237);
  const weight = 72.5747792; // Exact conversion of 160 international avoirdupois pounds.
  near(estimate(1, 0, weight, 0.68, 0.015), 0.02836830579584821);
  near(estimate(4, 2, weight, 0.68, 0.015), 0.08347322318339284);
  near(estimate(4, 2, weight, 0.55, 0.015), 0.11029416684492205);
  near(estimate(21, 0, weight, 0.68, 0.015), 0.5957344217128124);
});
test('zero consumption and elapsed elimination cannot produce negative BAC', () => {
  for (let hours = 0; hours <= 12; hours += 1) near(estimate(0, hours, 72.5747792, 0.68, 0.015), 0);
  near(estimate(1, 12, 72.5747792, 0.68, 0.015), 0);
});
test('direction and hourly elimination agree with model assumptions', () => {
  const a = estimate(4, 0, 72.5747792, 0.68, 0.015);
  near(a - estimate(4, 1, 72.5747792, 0.68, 0.015), 0.015);
  assert.ok(estimate(5, 0, 72.5747792, 0.68, 0.015) > a);
  assert.ok(estimate(4, 0, 90, 0.68, 0.015) < a);
  assert.ok(estimate(4, 0, 72.5747792, 0.55, 0.015) > a);
  assert.ok(estimate(4, 2, 72.5747792, 0.68, 0.01) > estimate(4, 2, 72.5747792, 0.68, 0.03));
});
test('US standard drink equivalents and a stronger large beer', () => {
  near(servingStandardDrinks(12, 5), 1);
  near(servingStandardDrinks(5, 12), 1);
  near(servingStandardDrinks(1.5, 40), 1);
  near(servingStandardDrinks(16, 8), 2.1333333333333333);
});
test('threshold boundaries have explicit inclusive semantics', () => {
  assert.equal(classify(0, 0.04, 0.08), 'low');
  assert.equal(classify(0.039999, 0.04, 0.08), 'low');
  assert.equal(classify(0.04, 0.04, 0.08), 'mid');
  assert.equal(classify(0.079999, 0.04, 0.08), 'mid');
  assert.equal(classify(0.08, 0.04, 0.08), 'high');
});
test('all 286 table coordinates yield finite, nonnegative values', () => {
  for (let drinks = 0; drinks <= 21; drinks += 1) {
    for (let hours = 0; hours <= 12; hours += 1) {
      const result = estimate(drinks, hours, defaults.weightKg, defaults.r, defaults.beta);
      assert.ok(Number.isFinite(result) && result >= 0);
    }
  }
});
test('normalization accepts a complete valid customized state', () => {
  const valid = { weightKg: 81.5, unit: 'kg', r: 0.61, preset: 'custom', beta: 0.02,
    low: 0.025, high: 0.075, drinks: 7, hours: 4, view: 'table', servingOz: 16, abv: 8 };
  assert.deepEqual(plain(normalizeState(valid)), valid);
});
test('preset names consistently determine their documented distribution factor', () => {
  near(normalizeState({ ...defaults, preset: 'higher', r: 0.55 }).r, 0.68);
  near(normalizeState({ ...defaults, preset: 'lower', r: 0.68 }).r, 0.55);
  near(normalizeState({ ...defaults, preset: 'custom', r: 0.57 }).r, 0.57);
  near(stateFromHash('#v=1&preset=lower&r=.9').r, 0.55);
  near(stateFromHash('#v=1&preset=custom&r=.57').r, 0.57);
});
test('all documented numeric range endpoints survive URL round trips', () => {
  const low = normalizeState({ ...defaults, preset: 'custom', weightKg: 20, r: 0.4,
    beta: 0.01, low: 0.001, high: 0.002, drinks: 0, hours: 0, servingOz: 0.1, abv: 0.1 });
  const high = normalizeState({ ...defaults, preset: 'custom', weightKg: 350, r: 0.9,
    beta: 0.03, low: 0.29, high: 0.3, drinks: 21, hours: 12, servingOz: 128, abv: 96 });
  for (const state of [low, high]) assert.deepEqual(plain(stateFromHash(stateToHash(state))), plain(state));
});
test('unit changes preserve the physical body weight', () => {
  const pounds = normalizeState({ ...defaults, weightKg: 160 * model.LB_TO_KG, unit: 'lb' });
  const kilograms = normalizeState({ ...defaults, weightKg: 160 * model.LB_TO_KG, unit: 'kg' });
  near(pounds.weightKg, kilograms.weightKg);
  near(estimate(4, 2, pounds.weightKg, pounds.r, pounds.beta), estimate(4, 2, kilograms.weightKg, kilograms.r, kilograms.beta));
});
test('nonfinite and out-of-range state values recover valid defaults', () => {
  const invalid = { weightKg: Infinity, unit: 'stone', r: NaN, beta: -4, low: -1, high: 100,
    drinks: 100, hours: -3, view: 'unrecognized', servingOz: 0, abv: 400 };
  const result = plain(normalizeState(invalid));
  for (const key of ['weightKg', 'unit', 'r', 'beta', 'low', 'high', 'drinks', 'hours', 'view', 'servingOz', 'abv']) {
    assert.equal(result[key], defaults[key], key);
  }
});
test('reversed or equal color thresholds reset together', () => {
  for (const pair of [{ low: 0.08, high: 0.04 }, { low: 0.06, high: 0.06 }]) {
    const result = normalizeState({ ...defaults, ...pair });
    near(result.low, defaults.low);
    near(result.high, defaults.high);
    assert.ok(result.low < result.high);
  }
});
test('share state round trips without changing customized assumptions', () => {
  const state = normalizeState({ ...defaults, weightKg: 81.5, unit: 'kg', r: 0.61, preset: 'custom', beta: 0.02,
    low: 0.025, high: 0.075, drinks: 7, hours: 4, servingOz: 16, abv: 8 });
  const hash = stateToHash(state);
  assert.ok(hash.startsWith('#'));
  assert.equal(new URLSearchParams(hash.slice(1)).get('v'), '1');
  assert.deepEqual(plain(stateFromHash(hash)), plain(state));
});
test('malformed and hostile share parameters remain inert valid data', () => {
  const badHashes = ['', '#', '#%E0%A4%A', '#v=1&weightKg=NaN&r=Infinity&beta=-99',
    '#v=1&low=.09&high=.01&drinks=-1&hours=999',
    '#v=1&unit=%3Cscript%3Ealert(1)%3C%2Fscript%3E&view=javascript%3Aalert(1)&unknown=ignored',
    '#__proto__=%7B%22polluted%22%3Atrue%7D&constructor=invalid'];
  for (const hash of badHashes) {
    const state = stateFromHash(hash);
    const normalized = normalizeState(state);
    assert.deepEqual(plain(state), plain(normalized));
    assert.ok(state.low < state.high);
    assert.ok(Number.isFinite(estimate(state.drinks, state.hours, state.weightKg, state.r, state.beta)));
    assert.equal(Object.prototype.polluted, undefined);
  }
});
test('unsupported share format versions fall back to the current defaults', () => {
  for (const hash of ['#v=999&weightKg=100', '#weightKg=100', '#v=&weightKg=100']) {
    assert.deepEqual(plain(stateFromHash(hash)), defaults);
  }
});
test('missing objects and fractional matrix coordinates normalize safely', () => {
  for (const input of [null, undefined, '', 1]) assert.deepEqual(plain(normalizeState(input)), defaults);
  const state = normalizeState({ ...defaults, drinks: 2.5, hours: 0.5 });
  assert.equal(state.drinks, defaults.drinks);
  assert.equal(state.hours, defaults.hours);
});
test('fresh state uses the requested 0.040 and 0.080 marker defaults', () => {
  for (const state of [defaults, plain(normalizeState({})), plain(stateFromHash('')), plain(stateFromHash('#v=1'))]) {
    near(state.low, 0.04);
    near(state.high, 0.08);
  }
});
test('existing links preserve explicit historical and custom marker settings', () => {
  const state=stateFromHash('#v=1&low=0.03&high=0.06&preset=higher');
  near(state.low, 0.03);
  near(state.high, 0.06);
  const again=stateFromHash(stateToHash(state));
  near(again.low, 0.03);
  near(again.high, 0.06);
});
test('volume and implied grams per hour obey independently checked units', () => {
  const weight=72.5747792;
  near(model.distributionVolume(weight,0.68),49.350849856);
  near(model.impliedEliminationGrams(weight,0.68,0.015),7.4026274784);
  near(model.impliedEliminationGrams(weight,0.55,0.015),5.987419284);
  near(model.impliedEliminationGrams(weight*2,0.68,0.015),14.8052549568);
  const volume=model.distributionVolume(weight,0.68);
  const removal=model.impliedEliminationGrams(weight,0.68,0.015);
  near(removal/(10*volume),0.015);
  near(estimate(4,0,weight,0.68,0.015)-estimate(4,1,weight,0.68,0.015),removal/(10*volume));
});
process.stdout.write(`${passed} independent model checks passed.\n`);
