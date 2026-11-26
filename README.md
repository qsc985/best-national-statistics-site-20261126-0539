[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# Japan Stat Atlas

An independent atlas of Japan's national statistics — population, economy, labour
market, prices and regions — as a static site that runs offline in any browser,
on desktop and on a phone.

## What it covers

- **Overview** — six headline indicators (population, GDP, inflation, unemployment,
  life expectancy, government debt), ten-year population and GDP charts, and the latest
  statistical releases.
- **Population** — the 2015–2024 trend, the age structure, and a searchable, sortable
  table of all 47 prefectures with population, area and density.
- **Economy** — real GDP growth, GDP in dollars, the sector mix (services / industry /
  agriculture) and Japan's top export destinations, on switchable tabs.
- **Labour & Prices** — unemployment and inflation charts, wages, and everyday prices
  in Tokyo.
- **Regions** — population by region, a prefecture picker with a detail card, and the
  ten largest cities.
- **Data & Sources** — headline indicators by year (pick any year 2015–2024), a CSV
  download of every series, and the source of every figure.

Every figure is real and names its source and year (World Bank, Statistics Bureau of
Japan, Bank of Japan, IMF, MHLW). The brand and design are original; the site is not
affiliated with any government office.

## Running it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

No build step, no network requests: `app/` is plain files (`index.html`, `style.css`,
`data.js`, `charts.js`, `views.js`, `main.js`) and every chart is inline SVG drawn
from the site's own data.

## Hand-in

`main.ts` copies `app/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`)
and writes `/output/dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts` (the kit's copy, unchanged).

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
