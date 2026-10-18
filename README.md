# BAC Explorer

A standalone, mobile-friendly educational BAC table. All application code, styles, icons, and explanations are in `index.html`. It has no runtime dependencies, build step, account, backend, external fonts, or analytics.

## Use online

[Open BAC Explorer](https://jcreinhold.github.io/bac-explorer/)

## Open it locally

Double-click `index.html`, or drag it into a modern web browser. It works offline after the file is downloaded. Only the optional source links require internet access.

You can send this HTML file directly to your partner. They open their own copy and change their own settings.

## What is included

- A full matrix: 0–21 US standard drinks × 0–12 hours spent drinking.
- BAC percentages on every cell, selectable scenarios, sticky headers, and keyboard arrow navigation.
- Body weight in lb or kg; numeric r presets (0.68 / 0.55 L/kg), an optional body-fat estimate, a manual r, and plain-language explanations.
- Editable caution markers (defaults 0.040% / 0.080%) and elimination assumption, with immediate validation and recalculation.
- A readable “One hour” view for small screens, alongside the scrollable full matrix.
- A serving-size / ABV converter. Table rows always stay 14 g US standard drinks.
- State in the URL fragment; Copy share link; printable layout including assumptions.
- Formula, units, academic/government sources, and limitations in the app and `MODEL.md`.

The output is labeled an approximate session estimate. This simple model cannot predict an individual's actual highest BAC, measure intoxication, or establish whether driving is safe. The default 0.040% / 0.080% markers are personal caution references, not medically validated risk categories or driving guidance. “Buzzed” is subjective and can occur at different BACs.

## Publish with GitHub Pages

1. Create a GitHub repository, for example `bac-explorer`. A public repository supports Pages on GitHub Free.
2. Upload the contents of this folder to the repository root. At minimum, include `index.html` and the empty `.nojekyll` file. The documentation and tests are optional for hosting.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**. Choose your `main` branch and **/(root)**, then **Save**.
5. When deployment finishes, open the URL displayed in Pages settings. A typical project URL is `https://YOUR-USERNAME.github.io/bac-explorer/`; this is a template, not an already deployed address.
6. Open that hosted page, choose settings, and use **Copy share link**. Your partner can change their settings without affecting yours.

The app is published at [jcreinhold.github.io/bac-explorer](https://jcreinhold.github.io/bac-explorer/). A `file:` or `localhost` link works only on your own device; use the hosted address for cross-device links. GitHub Pages publishes the application publicly. Personal settings remain in each visitor's URL fragment rather than in the repository.

The deployment steps follow [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Any static host can serve the same `index.html`, including under a subdirectory.

## Body composition and elimination

The factor control chooses r, an effective dilution volume per kilogram. The calculation uses its numeric value, not a sex or gender label. A live readout shows r and the total dilution volume.

Choose **Estimate from body fat** to enter an optional measured percentage. It derives r from fat-free mass using the conventional 0.732 hydration assumption and a selectable blood-water reference, default 0.825 kg/L. The formula, assumptions, and citations are visible in **Body-fat formula & sources** and explained in MODEL.md. It is an assumption-based derivation, not an independently validated athlete BAC formula. No body-fat value is supplied by default.

**Custom r** remains available. **Use this estimate as manual r** copies the derived value into manual mode for adjustment. Body fat can be 3–60% and manual r can be 0.30–0.90 L/kg; these are exploration limits, not healthy ranges. Body-fat measurement error and hydration can materially affect the estimate. The feature leaves elimination independently adjustable.

Elimination is an independently adjustable drop in BAC concentration, defaulting to 0.015 percentage points/hour. Another readout shows the grams/hour implied by that rate, weight, and r. Expanded notes explain the population-average default and why metabolic capacity cannot be inferred from weight and r alone.

Existing shared links keep their explicit marker settings. Open the base website or select **Reset all settings** to use the updated defaults.

## Using the table

“Hours” is total time from the first drink to the end of the session. A row is the total number of standard drinks in that interval, not drinks per hour. The 0-hour column is a theoretical fully absorbed dose before elimination, not an immediate reading. Actual peaks may occur during drinking or after the last drink.

Click a cell to update the scenario. To navigate with a keyboard, Tab to the selected cell and use arrow keys; Home/End choose the first/last hour. “One hour” shows all drink rows for the hour selected in the scenario. Print uses the current table view, so select “Full table” before printing if you want every hour.

The optional converter estimates US standard drinks in one serving using fluid ounces and ABV. For example, 16 fl oz at 8% ABV is approximately 2.13 US standard drinks. The table uses whole-drink rows; the converter intentionally does not round your serving into a selected row automatically.

Copy share link includes the current weight, weight unit, distribution assumption, elimination rate, caution markers, selected cell, table view, converter settings, and body-fat/blood-water settings if entered. An entered body-fat value is retained for comparison even when another r mode is selected, and is included in copied links. Anyone with the link can read these settings. No cookies or local storage are used. Clipboard access can require HTTPS or localhost; a manual-copy field appears when automatic copying is unavailable.

## Verify the model

With Node.js installed, run from this folder:

```sh
node tests/model-test.cjs
```

The dependency-free tests extract the actual model script from `index.html`. They verify independent numeric anchors, all 286 coordinates, units, zero clamping, threshold boundaries, valid ranges, preset precedence, malformed inputs, and URL round trips. See `QA.md` for browser checks completed with this delivery.

For a local HTTP preview, if desired:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Stop the preview with Control-C. Hosting the file is optional for local use.

## Files

- `index.html` — the entire runnable app.
- `.nojekyll` — tells GitHub Pages to serve static files directly.
- `MODEL.md` — formula, units, evidence, assumptions, and limitations.
- `QA.md` — completed verification and remaining limits.
- `tests/model-test.cjs` — dependency-free regression checks.
