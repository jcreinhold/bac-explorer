# Verification

Checked October 16, 2026.

## Automated calculation and state checks

`node tests/model-test.cjs` — **16 checks passed** against the model script extracted from the shipped HTML, with no third-party test dependencies.

Coverage includes independently calculated numerical examples; all 286 coordinates; nonnegative clamping; elimination and dose direction; beer/wine/spirits equivalence; inclusive threshold boundaries; lb/kg conversion; documented numeric limits; preset precedence; custom state round trips; unsupported URL versions; nonfinite, fractional, malformed, and hostile parameters; and paired marker validation.

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

## Verification limits

The preview browser allows HTTP/HTTPS navigation and blocked opening a `file:` URL. Direct-file mode was therefore not exercised in that browser. The file contains no imports, remote assets, network calls, or server dependencies; history and clipboard failures are handled, and it is designed to open directly in ordinary browsers.

Print styles and the Print button are implemented, including the currently selected table view and model assumptions. A physical printout or browser-generated PDF was not visually verified. Browser background-color printing preferences can affect the band colors; the numeric values, legend, and assumptions remain text.

The clipboard success path was exercised. The manual-copy fallback is implemented but was not forced by changing browser permissions. The included Pages instructions were checked against GitHub's official documentation.

Model tests verify implementation, not predictive medical accuracy. This table is not an individualized BAC measurement or actual peak model.
