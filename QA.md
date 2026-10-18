# Verification

Initial release checked October 16, 2026. The default-marker, model-explanation, and optional body-fat updates were checked October 18, 2026.

## Automated calculation and state checks

`node tests/model-test.cjs` — **25 checks passed** against the model script extracted from the shipped HTML, with no third-party test dependencies.

Coverage includes independently calculated numerical examples; all 286 coordinates; nonnegative clamping; elimination and dose direction; beer/wine/spirits equivalence; inclusive threshold boundaries; lb/kg conversion; documented numeric limits; preset precedence; custom state round trips; unsupported URL versions; nonfinite, fractional, malformed, and hostile parameters; paired marker validation; fresh 0.040% / 0.080% defaults; preservation of explicit older-link markers; and independent unit checks for effective dilution volume and implied grams/hour.

Body-fat checks add independent numerical anchors, fat-free mass and water mass balance, equivalence to the body-water BAC equation, precedence of derived versus manually chosen r, both blood-water references and input endpoints in shared URLs, missing/invalid input handling, and compatibility with earlier links that contain no body-fat measurement.

One independent anchor: 160 lb, 4 US standard drinks over 2 hours, r = 0.68, elimination 0.015 percentage points/hour gives 0.083473223…%, displayed as 0.083%. Switching to r = 0.55 gives 0.110294166…%, displayed as 0.110%.

## Browser checks completed

The app was served locally over HTTP and checked in the desktop app's browser.

- At 1440 × 1000, all 13 hour columns fit within the full-table panel, with no page overflow.
- At 375 × 850, the full table scrolls inside its own region, and the page stays within the viewport. One-hour mode shows 22 larger, readable drink rows.
- Weight and assumption changes immediately update the selected result and table.
- Switching lb/kg preserves the result. The 20 kg boundary converts to lb without invalidating the input; boundary conversion rounding was corrected during review.
- Invalid body weight hides the table, clears the selected number, shows a plain-language error, and disables copying/printing.
- Reversed caution markers show an error and clear the result; correcting them restores the table.
- A 16 fl oz, 8% ABV serving converts to approximately 2.13 US standard drinks without redefining table rows.
- A copied URL restored a custom weight, r, elimination rate, markers, scenario, view, and converter settings after reset.
- Arrow navigation moves selection, changes the hour, and preserves one keyboard tab stop, including in one-hour mode.
- Console inspection after the tested interactions showed no warnings or errors.
- Desktop and phone screenshots are supplied alongside the app bundle.

## October 18 update checks

- Fresh pages and Reset all settings use 0.040% and 0.080%. Explicit 0.030% / 0.060% markers in an older shared link remain intact until reset.
- The parameter-first control reads “Alcohol dilution factor (r)” with options 0.68 L/kg, 0.55 L/kg, and Custom r. The concise explanation maps the traditional adult reference averages below the control.
- At 160 lb and r = 0.68, the new readouts show approximately 49.4 L effective dilution volume and 7.4 g/hour implied removal at beta = 0.015.
- Selecting r = 0.55 changes those readouts to 39.9 L and 6.0 g/hour. Custom r = 0.60 and beta = 0.020 show 43.5 L and 8.7 g/hour.
- Invalid r clears the derived readouts and table; correcting it recovers the results.
- Expanded body-composition and elimination explanations were inspected. At 375 × 850, the revised control and explanatory text remain readable with no page overflow.
- Browser console inspection during these checks showed no warnings or errors.

## Optional body-fat update checks

- Fresh pages retain the numeric 0.68 preset and a blank body-fat input. Selecting the optional mode without a measurement clears the estimate and disables sharing and transfer to manual mode.
- At 160 lb, 10% body fat, and the 0.825 blood-water reference, the readouts show r = 0.799 L/kg, modeled fat-free mass 65.3 kg, about 47.8 L body water, and about 58.0 L effective dilution volume. The default 3-drink, 2-hour scenario displays 0.042%.
- The alternate 0.838 reference gives r = 0.786 and the scenario displays 0.044%. Transfer to manual mode preserves the full value 0.7861575178997614; editing manual r to 0.7 takes precedence. Returning to body-fat mode restores the derived value.
- Switching lb/kg preserves the scenario estimate. A 60% example with the alternate reference transfers to manual r = 0.3494033412887828 without clipping or an input error.
- Entering 0% clears the result and derived readouts, shows a plain-language error, and disables sharing. Correcting the input restores the estimate.
- Copying a link, resetting, and reopening it restores body fat, the blood-water reference, the active method, weight unit, and scenario. Reset clears the optional measurement and restores the default preset.
- At 375 × 850, the new controls and expanded formula/source notes remain readable without page overflow. The phone screenshot is included alongside the bundle.
- Browser console inspection after these interactions showed no warnings or errors.

## Verification limits

The preview browser allows HTTP/HTTPS navigation and blocked opening a `file:` URL. Direct-file mode was therefore not exercised in that browser. The file contains no imports, remote assets, network calls, or server dependencies; history and clipboard failures are handled, and it is designed to open directly in ordinary browsers.

Print styles and the Print button are implemented, including the currently selected table view and model assumptions. A physical printout or browser-generated PDF was not visually verified. Browser background-color printing preferences can affect the band colors; the numeric values, legend, and assumptions remain text.

The clipboard success path was exercised. The manual-copy fallback is implemented but was not forced by changing browser permissions. The included Pages instructions were checked against GitHub's official documentation.

Model tests verify implementation, not predictive medical accuracy. This table is not an individualized BAC measurement or actual peak model.
