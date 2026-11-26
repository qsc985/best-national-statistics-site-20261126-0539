[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# Japan Stat Atlas

A national statistics site for Japan, built as plain static files that run
offline in any browser — desktop and phone — with no network request.

## What it covers

- **Overview** — six headline indicators (population, GDP, GDP per person,
  unemployment, CPI, life expectancy), a population trend chart, a GDP growth
  chart, and the latest releases.
- **Population** — population trend and age-structure charts, a searchable
  and sortable table of all 47 prefectures (population, area, capital,
  region, density), and an annual table with a year selector.
- **Economy** — tabs for growth (real GDP, 2019–2024), structure (services /
  industry / agriculture) and trade (exports, imports, top partners).
- **Labour & Prices** — unemployment and CPI charts, average monthly cash
  earnings, and a city price table.
- **Regions** — population by region, a prefecture picker with a detail card,
  and the ten largest cities.
- **Data & Sources** — key indicators by year, a working CSV download of the
  dataset, and full sources and method notes.

Every figure carries its source and year on the page: Statistics Bureau of
Japan, Cabinet Office, Ministry of Finance, Ministry of Health, Labour and
Welfare, IMF and World Bank.

## How it is built

- `app/index.html` — the shell (navigation, footer, script tags).
- `app/data.js` — all the figures, each with its source.
- `app/charts.js` — small inline-SVG chart builders (line, bar, horizontal
  bar, donut); no chart library.
- `app/app.js` — the hash router and the page renderers.
- `app/styles.css` — the navy / vermilion / paper design.
- `main.ts` — copies `app/` and `screenshots/` to `/output` (or
  `$MAKEFUN_OUTPUT_DIR`) and writes `dossier.json` with `buildDossier`.
- `serve.ts` — serves `app/` locally for testing (`node serve.ts`).

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

## License

MIT — see `LICENSE`.
