# BAC Explorer: calculation and interpretation

This app is an educational comparison table. It computes a simplified estimate near the end of a hypothetical drinking session. It does **not** measure BAC, predict a person's actual highest BAC, determine impairment, or establish when driving is safe.

Sources and the body-composition/elimination explanations were checked on October 18, 2026. The formula and assumptions below are implemented in `index.html`; there is no remote calculation service.

## Formula and units

```text
weight_kg = weight_lb × 0.45359237
alcohol_g = US_standard_drinks × 14

estimated_BAC_percent = max(0, alcohol_g / (10 × r × weight_kg) − beta × hours)
```

| Quantity | Meaning and units |
| --- | --- |
| US standard drinks | Total consumed over the session, not drinks per hour. Each table row uses 14 grams of ethanol per drink. |
| `weight_kg` | Body mass in kilograms. Switching between lb and kg converts the same underlying weight. |
| `r` | Apparent alcohol distribution volume in liters per kilogram (L/kg). Multiplying by body mass gives an apparent volume in liters. |
| `beta` | Assumed elimination rate in BAC percentage points per hour, numerically equivalent to g/dL/hour. |
| `hours` | Total time from the first drink to the end of the drinking session. |
| `estimated_BAC_percent` | Numeric BAC in g/dL, displayed with a percent sign under the usual US convention. For example, `0.08` becomes **0.08% BAC**. |

Dividing alcohol grams by distribution volume gives g/L. Dividing by 10 converts this to g/dL. Thus **0.08% BAC means 0.08 grams of alcohol per 100 mL of blood**; it is also 80 mg per 100 mL. The app uses the familiar percentage display rather than unlabeled scaled numbers. This unit interpretation agrees with [NIAAA's BAC explanation](https://www.niaaa.nih.gov/alcohols-effects-health/alcohol-drinking-patterns).

The model is a simplified member of the Widmark family. It uses distribution and elimination assumptions from the scholarly literature; it is not individually calibrated. A controlled study of 108 male participants examined Widmark estimates and found substantial variation in both parameters. That study supports the model family, rather than universal accuracy for arbitrary drinking sessions. See [Gullberg & Jones (1994)](https://doi.org/10.1016/0379-0738(94)90248-8).

## Defaults and customization

- **Weight:** 160 lb initially; the user can change it independently of anyone else's settings.
- **Distribution:** `r = 0.68 L/kg` by default, with a second preset of `0.55 L/kg` and a custom input from 0.40 to 0.90.
- **Elimination:** `beta = 0.015` BAC percentage points/hour, with an exploration range of 0.010 to 0.030.
- **Reference markers:** 0.040% and 0.080% BAC initially, both editable.

### What r means, and how body composition matters

**r is an effective alcohol-dilution volume per kilogram of body weight.** At r = 0.68 L/kg, a 72.6 kg person has a modeled distribution volume of about 49.4 L. “Apparent” means a volume inferred from alcohol dose and blood concentration; it is not a measured anatomical space, blood volume, or percentage of the body made of water. In particular, r = 0.68 does not mean 68% body water.

Alcohol distributes mainly in body water. Muscle contains more water than fat. At the same weight, more muscle and less body fat generally mean a larger dilution volume and higher r; more body fat generally means lower r. Differences in body composition help explain the traditional adult male/female average difference. A controlled study compared body-fat-derived and alcohol-curve-derived distribution volumes, while later work discusses limitations of fixed factors: [Cowan et al. (1996)](https://pubmed.ncbi.nlm.nih.gov/8872236/), [Maskell et al. (2020)](https://doi.org/10.1016/j.forsciint.2020.110532).

The control is labeled **Alcohol dilution factor (r)**, and its presets are numeric: **0.68 L/kg**, **0.55 L/kg**, or **Custom r**. A short explanation below identifies the traditional adult male/female reference averages and says that anyone can use either preset or a custom value. Current body composition may differ from either average. These historical study-group labels should not be read as evidence that the studies measured gender identity or that a person's sex assignment determines an individual r.

A measured body-fat percentage can inform the direction of a comparison, but it is not r and should not be subtracted from 100% to obtain r. This app does not claim a validated one-to-one body-fat-to-r conversion. The custom range permits exploration; it is not an individualized confidence interval. Age, hydration, blood-water concentration, and how body composition is measured also matter.

### Why the elimination default is a concentration drop

The default **0.015 BAC percentage points/hour** is a population approximation, not a personal measurement. For example, a post-absorption BAC of 0.080% would fall to 0.065% after one modeled hour. [Jones (2010)](https://pubmed.ncbi.nlm.nih.gov/20304569/) supports this as a useful average for moderate drinkers and describes wider rates under different conditions. The interface range 0.010–0.030 is for comparison, not the full physiological range or an individualized interval.

Distribution volume and elimination are related. If V is apparent distribution volume in liters and E is alcohol removed in grams/hour, unit conversion gives:

```text
V = r × weight_kg
beta = E / (10 × V)
E = 10 × beta × r × weight_kg
```

At 160 lb, r = 0.68, and beta = 0.015, V is about **49.4 L** and the implied removal is about **7.4 g/hour**. The UI shows both dynamically. This is a consequence of the chosen assumptions, not a separate estimate of liver function.

For a fixed E, a larger V means a smaller concentration drop. E itself is not fixed across people: lean mass and liver size are associated with grams/hour, and food, genetics, health, and drinking history can also affect elimination. A primary study distinguishes alcohol elimination in grams/hour from the descending concentration slope, and another relates elimination to fat-free mass: [Vatsalya et al. (2023)](https://pubmed.ncbi.nlm.nih.gov/36152778/), [Seyedsadjadi et al. (2023)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11265204/).

Weight and r alone cannot identify an individual's metabolic capacity. The app therefore keeps beta independently adjustable. Holding beta constant while changing weight or r implicitly changes the grams/hour the model assumes; the dynamic readout makes that explicit. This does not assert physiological independence of the parameters. The linear approximation is also less reliable near zero BAC and during ongoing absorption.

## What the table assumes—and what “peak” means

Every cell assumes:

1. No alcohol was already in the body before the session.
2. The modeled dose is fully absorbed and distributed, with no separate absorption or bioavailability correction.
3. Elimination proceeds at a constant rate over the entire stated interval, with enough alcohol present for that approximation to apply.
4. Distribution volume is described by the selected constant `r`.

The table has no information about when each drink was taken. An evenly spread session and a session with most drinks near its end receive the same calculation, although actual BAC curves could differ greatly. Food, absorption delays, beverage composition, body composition, medications, health conditions, and metabolism can also change actual concentration or effects.

**Hours are time spent drinking, not time since the last drink.** The 0-hour column is a theoretical fully absorbed dose before modeled elimination. It is not a reading immediately after drinking or evidence that alcohol enters the blood instantly.

**The output is not an actual peak prediction.** A person's highest BAC may occur during the session or after the last drink. A controlled experiment found different peak levels and timing after equal ethanol doses delivered as beer, wine, and spirits. See [Mitchell, Teigen & Ramchandani (2014)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4112772/). [NIAAA explains](https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-dangers-of-alcohol-overdose) that alcohol can keep entering the bloodstream after drinking stops.

Negative mathematical results are clipped to zero. **0.000% is the model's floor, not proof that no alcohol remains.** Low estimates after long sessions are especially unreliable when drinking was concentrated near the end, and they cannot rule out earlier higher BAC. Rounding to three decimal places is for readability and does not imply that precision is achievable. No individualized confidence interval is shown because the available inputs do not justify one.

## Color bands and legal limits

The three colors compare the unrounded estimate with two chosen reference markers:

- Below the first marker.
- At or above the first marker and below the second.
- At or above the second marker.

The defaults, 0.040% and 0.080%, are **personal caution markers for recreational drinking**, not validated medical risk categories or drinking targets. The first is a rough “buzzed” reference chosen for this app, not a universal onset threshold. Subjective feelings vary, and impairment can occur below it. The lowest band does not mean safe. Color boundaries cannot diagnose impairment or account for medication interactions and other risks.

0.08% is a familiar US driving-law reference, but laws and driver-specific requirements vary, and impairment can occur below legal thresholds. The default second marker coincides with that familiar reference, but the color bands are personal caution markers and do not encode jurisdiction-specific laws. Never use an estimated number, its color, or a modeled zero to decide whether to drive. See [NHTSA's alcohol and driving information](https://www.nhtsa.gov/risky-driving/drunk-driving).

## US standard drinks and the optional serving helper

Table rows always represent **14-g US standard drinks**. Familiar approximate equivalents are 12 US fl oz of 5% beer, 5 US fl oz of 12% wine, and 1.5 US fl oz of 40% spirits (80 proof), following [NIAAA's standard-drink definition](https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink).

The optional helper uses the corresponding approximate volume convention:

```text
US_standard_drinks ≈ serving_US_fl_oz × (ABV_percent / 100) / 0.6
```

For example, 16 US fl oz at 8% ABV is approximately 2.13 standard drinks. The 0.6 fl oz ethanol convention is approximately 14 grams; these rounded conventions are not an exact density conversion. Changing the helper's serving size or strength does **not** redefine a table row or change the table's fixed 14-g dose per row. For mixed drinks, count all alcoholic ingredients.

## Reproducible numerical check

For 160 lb, 4 standard drinks, 2 hours, `r = 0.68`, and `beta = 0.015`:

```text
weight_kg = 160 × 0.45359237 = 72.5747792
alcohol_g = 4 × 14 = 56
BAC_percent = 56 / (10 × 0.68 × 72.5747792) − 0.015 × 2
            = 0.083473223…
display     = 0.083% BAC
```

This checks implementation and units; it does not establish the actual BAC of a person with those inputs.

## Source and layout distinction

The [University of New Mexico BAC Estimation Table](https://casaa.unm.edu/assets/html/bac.html) is an academic example of the drinks-by-hours presentation. Its current page source uses a different legacy calculation and scaled integer display. BAC Explorer independently implements the explicitly documented grams/kilograms model above rather than copying UNM's calculation. Neither UNM's layout nor this implementation supplies an individualized absorption model.

The user-requested Checkup & Choices table provides the intended matrix concept; it is not treated as scientific validation of this app's formula, colors, or interpretation.
