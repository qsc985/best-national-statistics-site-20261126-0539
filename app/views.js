// Japan Stat Atlas — views. Each page is a function of the shared state
// (selected year, region, search text, table sort) and returns HTML.
// All figures are escaped before they reach the page.

import {
  AGE_GROUPS, CITIES, COUNTRY, KEY_INDICATORS, PREFECTURES, RELEASES,
  SERIES, SECTORS, SOURCES, TRADE_PARTNERS, YEARS, density, regionTotals,
} from './data.js';
import { barChart, donutChart, hbarChart, lineChart } from './charts.js';

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function srcLine(text) {
  return `<p class="src">Source: ${escape(text)}</p>`;
}

function kpiCards() {
  return `<div class="kpis">${KEY_INDICATORS.map((k) => `<div class="kpi">
    <div class="label">${escape(k.label)}</div>
    <div class="value">${escape(k.value)} <span class="unit">${escape(k.unit)}</span></div>
    <div class="delta ${k.deltaClass}">${escape(k.delta)}</div>
    <div>${escape(k.note)}</div>
    <p class="src">${escape(k.source)}</p>
  </div>`).join('')}</div>`;
}

function releaseList() {
  return `<ul class="release-list">${RELEASES.map((r) => `<li>
    <div class="date">${escape(r.date)}</div>
    <a href="${escape(r.route)}">${escape(r.title)}</a>
    <p>${escape(r.body)}</p>
  </li>`).join('')}</ul>`;
}

function sectionCards() {
  const cards = [
    { route: '#/population', title: 'Population', text: '124.3 million people, an ageing society, and all 47 prefectures — searchable and sortable.', go: 'Explore population →' },
    { route: '#/economy', title: 'Economy', text: 'GDP, growth, trade partners and what Japan makes — with ten years of figures.', go: 'Explore the economy →' },
    { route: '#/labour', title: 'Labour & Prices', text: 'Unemployment at 2.5%, consumer prices, wages and the cost of living.', go: 'Explore labour & prices →' },
    { route: '#/regions', title: 'Regions', text: 'From Hokkaido to Okinawa: pick a region or a prefecture and compare it with the rest.', go: 'Explore regions →' },
    { route: '#/data', title: 'Data & Sources', text: 'Every series in one table, downloadable as CSV, with the source of every figure.', go: 'Get the data →' },
  ];
  return `<div class="grid-3">${cards.map((c) => `<a class="card card-link" href="${escape(c.route)}">
    <h3>${escape(c.title)}</h3>
    <p>${escape(c.text)}</p>
    <span class="go">${escape(c.go)}</span>
  </a>`).join('')}</div>`;
}

export function overview() {
  return `
<p class="eyebrow">Japan · 日本 · Updated ${escape(COUNTRY.updated)}</p>
<h1>Japan in numbers</h1>
<p class="lede">One atlas for the figures people actually look up: how many people live in Japan,
how the economy is doing, what things cost, and how the 47 prefectures compare.
Every figure names its source and year.</p>
${kpiCards()}
<div class="grid-2">
  <section class="card">
    <h2>Population is shrinking — slowly</h2>
    <div class="chart-wrap">${lineChart({ years: YEARS, values: SERIES.population.values, label: SERIES.population.label, unit: 'million people', color: '#12324f' })}</div>
    <p class="chart-note">Japan lost about 2.8 million people between 2015 and 2024. The decline is driven by
    fewer births — 720,000 in 2024, the lowest on record — not by emigration.</p>
    ${srcLine(SERIES.population.source + ', 2015–2024')}
  </section>
  <section class="card">
    <h2>The economy, in dollars</h2>
    <div class="chart-wrap">${barChart({ bars: YEARS.map((y, i) => ({ label: String(y), value: SERIES.gdp.values[i] })), label: SERIES.gdp.label, unit: 'US$ trillion', color: '#2f6fb2' })}</div>
    <p class="chart-note">Nominal GDP in US dollars fell in 2022–2024 mainly because the yen weakened against
    the dollar — in yen terms the economy kept growing.</p>
    ${srcLine(SERIES.gdp.source)}
  </section>
</div>
<div class="grid-2">
  <section class="card">
    <h2>Latest releases</h2>
    ${releaseList()}
  </section>
  <section class="card">
    <h2>Japan at a glance</h2>
    <div class="stat-strip">
      <span>Capital <b>${escape(COUNTRY.capital)}</b></span>
      <span>Land area <b>377,975 km²</b></span>
      <span>Prefectures <b>47</b></span>
      <span>Currency <b>yen (JPY)</b></span>
    </div>
    <p>Japan is the world's fourth-largest economy and its most aged large society:
    29.1% of the population is 65 or older. It is also one of the most urban —
    92% of people live in cities — and one of the safest, with life expectancy of 84 years.</p>
    <p>The fertility rate fell to 1.20 children per woman in 2023 (MHLW), the lowest
    ever recorded, while the number of foreign residents passed 3.7 million in 2024.</p>
    <p class="fine">Sources: World Bank 2023; Statistics Bureau of Japan 2024; MHLW 2023.</p>
  </section>
</div>
<h2>Find a section</h2>
${sectionCards()}`;
}

// ---------- Population ----------

function annualTable(seriesKeys, year) {
  const rows = YEARS.map((y) => {
    const cells = seriesKeys.map((k) => `<td class="num">${SERIES[k].values[YEARS.indexOf(y)]}</td>`).join('');
    return `<tr${y === year ? ' style="background:#fbe9e4"' : ''}><td>${y}</td>${cells}</tr>`;
  }).join('');
  const heads = seriesKeys.map((k) => `<th class="num">${escape(SERIES[k].label.replace(/ \(.*\)/, ''))}</th>`).join('');
  return `<div class="table-scroll"><table class="data">
    <thead><tr><th>Year</th>${heads}</tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function prefectureRows(state) {
  let rows = PREFECTURES.map((p) => ({ ...p, density: density(p) }));
  const q = state.search.trim().toLowerCase();
  if (q) rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q));
  if (state.regionFilter !== 'All regions') rows = rows.filter((p) => p.region === state.regionFilter);
  const key = state.sortKey;
  const dir = state.sortDir === 'desc' ? -1 : 1;
  rows.sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    return (typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))) * dir;
  });
  return rows;
}

export function population(state) {
  const rows = prefectureRows(state);
  const regions = ['All regions', ...new Set(PREFECTURES.map((p) => p.region))];
  const arrow = (key) => (state.sortKey === key ? (state.sortDir === 'asc' ? ' ↑' : ' ↓') : '');
  return `
<p class="crumb"><a href="#/">Overview</a> / Population</p>
<p class="eyebrow">Population</p>
<h1>124.3 million people — and falling</h1>
<p class="lede">Japan's population peaked at 128.1 million in 2008 and has fallen every year since.
The 2024 estimate is 124.3 million, down 0.6% on 2023. Below: the ten-year trend, the age
structure, and every prefecture.</p>
<div class="grid-2">
  <section class="card">
    <h2>Population, 2015–2024</h2>
    <div class="chart-wrap">${lineChart({ years: YEARS, values: SERIES.population.values, label: SERIES.population.label, unit: 'million people', color: '#12324f' })}</div>
    ${srcLine(SERIES.population.source + ', 2015–2024')}
  </section>
  <section class="card">
    <h2>Who lives here? Age structure, 2024</h2>
    <div class="chart-wrap">${hbarChart({ rows: AGE_GROUPS.map((a) => ({ label: a.group, value: a.millions })), label: 'Population by age group, millions, 2024', unit: 'million people', color: '#c2402a' })}</div>
    <p class="chart-note">29.1% of Japan is 65 or older — the highest share of any large country. Children
    (0–14) are 11.4%, the lowest share on record. Median age: about 49 years.</p>
    ${srcLine('Statistics Bureau of Japan, population estimates, 1 October 2024')}
  </section>
</div>
<section class="card" style="margin-top:18px">
  <h2>All 47 prefectures</h2>
  <p>Population and density, 2024 estimates. Search by prefecture, region or capital; click a column
  heading to sort. Tokyo is by far the largest — 14.1 million people in 2,194 km².</p>
  <div class="controls">
    <div class="control">
      <label for="pref-search">Search prefectures</label>
      <input type="search" id="pref-search" data-control="search" placeholder="e.g. Osaka, Tohoku, Sapporo" value="${escape(state.search)}">
    </div>
    <div class="control">
      <label for="region-filter">Region</label>
      <select id="region-filter" data-control="regionFilter">
        ${regions.map((r) => `<option${r === state.regionFilter ? ' selected' : ''}>${escape(r)}</option>`).join('')}
      </select>
    </div>
  </div>
  <div class="table-scroll"><table class="data">
    <thead><tr>
      <th><button data-sort="name">Prefecture${arrow('name')}</button></th>
      <th><button data-sort="region">Region${arrow('region')}</button></th>
      <th><button data-sort="capital">Capital${arrow('capital')}</button></th>
      <th class="num"><button data-sort="population">Population (m)${arrow('population')}</button></th>
      <th class="num"><button data-sort="area">Area (km²)${arrow('area')}</button></th>
      <th class="num"><button data-sort="density">Density (/km²)${arrow('density')}</button></th>
    </tr></thead>
    <tbody>
      ${rows.map((p) => `<tr>
        <td><strong>${escape(p.name)}</strong></td><td>${escape(p.region)}</td><td>${escape(p.capital)}</td>
        <td class="num">${p.population.toFixed(2)}</td><td class="num">${p.area.toLocaleString('en-US')}</td><td class="num">${p.density.toLocaleString('en-US')}</td>
      </tr>`).join('') || '<tr><td colspan="6">No prefecture matches that search.</td></tr>'}
    </tbody>
  </table></div>
  <p class="src">Source: Statistics Bureau of Japan, population estimates, 1 October 2024; land area from the Geospatial Information Authority of Japan. ${rows.length} of 47 prefectures shown.</p>
</section>
<section class="card" style="margin-top:18px">
  <h2>Annual figures, 2015–2024</h2>
  <p>Pick a year to highlight it in the table.</p>
  <div class="controls">
    <div class="control">
      <label for="year-select">Highlight year</label>
      <select id="year-select" data-control="year">
        ${YEARS.map((y) => `<option value="${y}"${y === state.year ? ' selected' : ''}>${y}</option>`).join('')}
      </select>
    </div>
  </div>
  ${annualTable(['population', 'growth', 'cpi', 'unemployment'], state.year)}
  <p class="src">Sources: Statistics Bureau of Japan; World Bank, World Development Indicators.</p>
</section>`;
}

// ---------- Economy ----------

export function economy(state) {
  const tab = state.econTab;
  const tradeRows = TRADE_PARTNERS.map((t) => `<tr>
    <td><strong>${escape(t.partner)}</strong></td><td class="num">${t.share.toFixed(1)}%</td><td>${escape(t.note)}</td>
  </tr>`).join('');
  return `
<p class="crumb"><a href="#/">Overview</a> / Economy</p>
<p class="eyebrow">Economy</p>
<h1>The world's fourth-largest economy</h1>
<p class="lede">Japan's GDP was about US$4.03 trillion in 2024 (IMF). Growth has been slow for three
decades, but the economy is the world's largest creditor nation and a top exporter of cars,
machinery and electronics.</p>
<div class="tabs" role="tablist" aria-label="Economy views">
  <button role="tab" aria-selected="${tab === 'growth'}" data-tab="growth">Growth</button>
  <button role="tab" aria-selected="${tab === 'structure'}" data-tab="structure">What Japan makes</button>
  <button role="tab" aria-selected="${tab === 'trade'}" data-tab="trade">Trade</button>
</div>
${tab === 'growth' ? `
<section class="card">
  <h2>Real GDP growth, 2015–2024</h2>
  <div class="chart-wrap">${barChart({ bars: YEARS.map((y, i) => ({ label: String(y), value: SERIES.growth.values[i] })), label: SERIES.growth.label, unit: '%', color: '#1d7a6e' })}</div>
  <p class="chart-note">The pandemic year, 2020, was the deepest fall (−4.2%). Growth bounced back in 2021
  (+2.6%) and was 1.7% in 2023, before slipping to −0.1% in 2024 as consumption weakened.</p>
  ${srcLine(SERIES.growth.source)}
</section>
<section class="card" style="margin-top:18px">
  <h2>GDP in dollars, 2015–2024</h2>
  <div class="chart-wrap">${lineChart({ years: YEARS, values: SERIES.gdp.values, label: SERIES.gdp.label, unit: 'US$ trillion', color: '#2f6fb2' })}</div>
  ${srcLine(SERIES.gdp.source)}
</section>` : ''}
${tab === 'structure' ? `
<div class="grid-2">
  <section class="card">
    <h2>What the economy is made of</h2>
    <div class="chart-wrap">${donutChart({ parts: SECTORS, label: 'Share of GDP by sector, 2023' })}</div>
    <div class="legend">${SECTORS.map((s) => `<span><span class="swatch" style="background:${s.color}"></span>${escape(s.name)} — ${s.share}%</span>`).join('')}</div>
    ${srcLine('World Bank, World Development Indicators, value added as % of GDP, 2023')}
  </section>
  <section class="card">
    <h2>Services dominate — industry still matters</h2>
    <p>Services are 70.5% of GDP, but Japan's world-leading industries are in manufacturing:
    cars (Toyota, Honda), electronics, machine tools and robotics. Manufacturing alone is about
    20% of GDP, far above the US (11%) or the UK (9%).</p>
    <p>Top exports by value are cars, integrated circuits, machinery and vehicle parts. The
    biggest exporters' home is Aichi prefecture — home to Toyota City — which ships more
    goods abroad than any other prefecture.</p>
    <div class="stat-strip">
      <span>GDP per person <b>US$32,400</b></span>
      <span>Exports of goods &amp; services <b>21.8% of GDP</b></span>
      <span>Government debt <b>251% of GDP</b></span>
    </div>
    <p class="fine">Sources: World Bank 2023; IMF World Economic Outlook 2024.</p>
  </section>
</div>` : ''}
${tab === 'trade' ? `
<section class="card">
  <h2>Where Japan sells</h2>
  <p>Japan exported about US$717 billion of goods in 2023. The United States overtook China as
  the top destination in 2023; together the two take nearly two-fifths of all exports.</p>
  <div class="chart-wrap">${hbarChart({ rows: TRADE_PARTNERS.map((t) => ({ label: t.partner, value: t.share })), label: 'Share of goods exports by destination, 2023', unit: '% of exports', color: '#2f6fb2', maxRows: 8 })}</div>
  <div class="table-scroll"><table class="data">
    <thead><tr><th>Destination</th><th class="num">Share of exports</th><th>Note</th></tr></thead>
    <tbody>${tradeRows}</tbody>
  </table></div>
  ${srcLine('UN Comtrade / JETRO, goods exports, 2023, rounded')}
</section>
<section class="card" style="margin-top:18px">
  <h2>Trade balance</h2>
  <p>Japan ran a goods trade deficit in 2022, 2023 and 2024 — the first sustained deficits since
  the 2010s — because energy imports (oil, gas, coal) became far more expensive while the yen
  weakened. The services balance is in deficit too, but income from overseas investments
  (about ¥35 trillion a year) keeps the current account in surplus.</p>
  <p class="fine">Source: Ministry of Finance, Trade Statistics of Japan, 2024.</p>
</section>` : ''}`;
}

// ---------- Labour & Prices ----------

export function labour(state) {
  return `
<p class="crumb"><a href="#/">Overview</a> / Labour &amp; Prices</p>
<p class="eyebrow">Labour &amp; Prices</p>
<h1>Jobs are plentiful; prices are rising again</h1>
<p class="lede">Unemployment is 2.5% — among the lowest in the G7 — and there are about 1.25 job
openings for every jobseeker. After decades of flat prices, inflation returned in 2022 and has
stayed above the Bank of Japan's 2% target since.</p>
<div class="grid-2">
  <section class="card">
    <h2>Unemployment, 2015–2024</h2>
    <div class="chart-wrap">${lineChart({ years: YEARS, values: SERIES.unemployment.values, label: SERIES.unemployment.label, unit: '% of labour force', color: '#1d7a6e' })}</div>
    <p class="chart-note">Unemployment never rose above 3.4% in this decade — Japan's labour market absorbs
    shocks by cutting hours and bonuses rather than jobs.</p>
    ${srcLine(SERIES.unemployment.source)}
  </section>
  <section class="card">
    <h2>Consumer price inflation, 2015–2024</h2>
    <div class="chart-wrap">${lineChart({ years: YEARS, values: SERIES.cpi.values, label: SERIES.cpi.label, unit: '% a year', color: '#c2402a' })}</div>
    <p class="chart-note">Prices were flat or falling from 2015 to 2021. Energy and food pushed inflation to
    3.3% in 2023; it eased to 2.7% in 2024. The Bank of Japan's target is 2%.</p>
    ${srcLine(SERIES.cpi.source)}
  </section>
</div>
<div class="grid-2">
  <section class="card">
    <h2>What workers earn</h2>
    <div class="stat-strip">
      <span>Average monthly wage <b>¥324,000</b></span>
      <span>Minimum wage <b>¥1,055 / hour</b></span>
      <span>Job-openings ratio <b>1.25</b></span>
    </div>
    <p>Nominal wages rose 2.8% in 2024, the fastest in three decades, after the annual spring
    wage round (shuntō) delivered a 5.1% base-pay rise. Even so, real wages fell in 2022 and
    2023 because prices rose faster, and only turned positive again in mid-2024.</p>
    <p>Women's labour-force participation reached 80% in 2024, up from 63% in 2012, and the
    share of workers in non-regular jobs is about 37%.</p>
    <p class="fine">Sources: Ministry of Health, Labour and Welfare, Monthly Labour Survey, 2024;
    Statistics Bureau of Japan, Labour Force Survey, 2024. Minimum wage is the national
    weighted average, October 2024.</p>
  </section>
  <section class="card">
    <h2>What things cost</h2>
    <p>Everyday prices in Tokyo, 2024 (Statistics Bureau of Japan, retail price survey):</p>
    <div class="table-scroll"><table class="data">
      <thead><tr><th>Item</th><th class="num">Price</th></tr></thead>
      <tbody>
        <tr><td>White rice, 5 kg</td><td class="num">¥2,900</td></tr>
        <tr><td>Bread, 1 loaf</td><td class="num">¥320</td></tr>
        <tr><td>Eggs, 10</td><td class="num">¥290</td></tr>
        <tr><td>Milk, 1 litre</td><td class="num">¥250</td></tr>
        <tr><td>Regular petrol, 1 litre</td><td class="num">¥175</td></tr>
        <tr><td>Train, central Tokyo one-way</td><td class="num">¥180</td></tr>
        <tr><td>Movie ticket, adult</td><td class="num">¥1,900</td></tr>
      </tbody>
    </table></div>
    <p class="fine">Prices are rounded survey averages; rice prices rose sharply in 2024 on a poor harvest.</p>
  </section>
</div>`;
}

// ---------- Regions ----------

export function regions(state) {
  const totals = regionTotals();
  const selected = PREFECTURES.find((p) => p.name === state.prefecture) ?? PREFECTURES[12];
  const inRegion = PREFECTURES.filter((p) => p.region === selected.region).sort((a, b) => b.population - a.population);
  const rank = [...PREFECTURES].sort((a, b) => b.population - a.population).findIndex((p) => p.name === selected.name) + 1;
  const regionPop = totals.find((t) => t.region === selected.region);
  return `
<p class="crumb"><a href="#/">Overview</a> / Regions</p>
<p class="eyebrow">Regions</p>
<h1>From Hokkaido to Okinawa</h1>
<p class="lede">Japan has eight regions and 47 prefectures. Pick a prefecture below to see it in detail —
its population, its density, and how it compares with its neighbours.</p>
<section class="card">
  <h2>Population by region</h2>
  <div class="chart-wrap">${hbarChart({ rows: totals.map((t) => ({ label: t.region, value: Math.round(t.population * 10) / 10 })), label: 'Population by region, millions, 2024', unit: 'million people', color: '#12324f', maxRows: 8 })}</div>
  <p class="chart-note">Kanto — Tokyo and its neighbours — holds 45.2 million people, more than a third of
  Japan. Hokkaido, the largest region by area, holds just 5.2 million.</p>
  ${srcLine('Statistics Bureau of Japan, population estimates, 1 October 2024')}
</section>
<div class="grid-2">
  <section class="card">
    <h2>Pick a prefecture</h2>
    <div class="controls">
      <div class="control">
        <label for="prefecture-select">Prefecture</label>
        <select id="prefecture-select" data-control="prefecture">
          ${PREFECTURES.map((p) => `<option${p.name === selected.name ? ' selected' : ''}>${escape(p.name)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="stat-strip">
      <span>Population <b>${selected.population.toFixed(2)} million</b></span>
      <span>Rank <b>#${rank} of 47</b></span>
    </div>
    <div class="stat-strip">
      <span>Capital <b>${escape(selected.capital)}</b></span>
      <span>Area <b>${selected.area.toLocaleString('en-US')} km²</b></span>
      <span>Density <b>${density(selected).toLocaleString('en-US')} / km²</b></span>
    </div>
    <p>${escape(selected.name)} is in the ${escape(selected.region)} region, which has
    ${regionPop.count} prefectures and ${regionPop.population.toFixed(1)} million people in total.
    Its capital is ${escape(selected.capital)}.</p>
    <p class="fine">Source: Statistics Bureau of Japan, population estimates, 1 October 2024.</p>
  </section>
  <section class="card">
    <h2>Prefectures in ${escape(selected.region)}</h2>
    <div class="table-scroll"><table class="data">
      <thead><tr><th>Prefecture</th><th class="num">Population (m)</th><th class="num">Density (/km²)</th></tr></thead>
      <tbody>
        ${inRegion.map((p) => `<tr${p.name === selected.name ? ' style="background:#fbe9e4"' : ''}>
          <td><strong>${escape(p.name)}</strong></td><td class="num">${p.population.toFixed(2)}</td><td class="num">${density(p).toLocaleString('en-US')}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>
    <p class="fine">Largest cities in Japan: see the list below.</p>
  </section>
</div>
<section class="card" style="margin-top:18px">
  <h2>Largest cities, 2024</h2>
  <div class="chart-wrap">${hbarChart({ rows: CITIES.map((c) => ({ label: c.city, value: c.population })), label: 'Largest cities by population, millions, 2024', unit: 'million people', color: '#c2402a' })}</div>
  ${srcLine('Statistics Bureau of Japan, population estimates, 1 October 2024')}
</section>`;
}

// ---------- Data & Sources ----------

export function dataPage(state) {
  const year = state.year;
  const i = YEARS.indexOf(year);
  const rows = [
    { name: 'Population', value: `${SERIES.population.values[i]} million`, source: 'Statistics Bureau of Japan' },
    { name: 'GDP (nominal)', value: `US$${SERIES.gdp.values[i]} trillion`, source: 'World Bank / IMF' },
    { name: 'Real GDP growth', value: `${SERIES.growth.values[i]}%`, source: 'World Bank' },
    { name: 'Consumer price inflation', value: `${SERIES.cpi.values[i]}%`, source: 'Statistics Bureau of Japan' },
    { name: 'Unemployment rate', value: `${SERIES.unemployment.values[i]}%`, source: 'Statistics Bureau of Japan' },
  ];
  return `
<p class="crumb"><a href="#/">Overview</a> / Data &amp; Sources</p>
<p class="eyebrow">Data &amp; Sources</p>
<h1>Every figure, in one place</h1>
<p class="lede">Pick a year to see the headline indicators for that year, or download the full
series as a CSV file to use yourself. Everything on this site comes from the sources below.</p>
<section class="card">
  <h2>Headline indicators by year</h2>
  <div class="controls">
    <div class="control">
      <label for="year-select">Year</label>
      <select id="year-select" data-control="year">
        ${YEARS.map((y) => `<option value="${y}"${y === year ? ' selected' : ''}>${y}</option>`).join('')}
      </select>
    </div>
    <div class="control">
      <button class="btn" data-action="download-csv">Download all series (CSV)</button>
    </div>
  </div>
  <div class="table-scroll"><table class="data">
    <thead><tr><th>Indicator — ${year}</th><th class="num">Value</th><th>Source</th></tr></thead>
    <tbody>${rows.map((r) => `<tr><td><strong>${escape(r.name)}</strong></td><td class="num">${escape(r.value)}</td><td>${escape(r.source)}</td></tr>`).join('')}</tbody>
  </table></div>
  <p class="fine">CSV download contains every year, 2015–2024, for all five series, plus the 47 prefectures.</p>
</section>
<section class="card" style="margin-top:18px">
  <h2>Sources &amp; methodology</h2>
  <ul class="source-list">
    ${SOURCES.map((s) => `<li><strong>${escape(s.name)}.</strong> ${escape(s.covers)} <em>${escape(s.note)}</em></li>`).join('')}
  </ul>
  <div class="callout">
    <p><strong>How to read these figures.</strong> Values are rounded to one decimal place for
    readability; the underlying published series carry more precision. Population figures are
    estimates as of 1 October each year. GDP in US dollars moves with the yen exchange rate, so
    a falling dollar figure does not always mean a shrinking economy in yen terms. Prefecture
    populations are estimates; the census (every five years, last in 2020, next in 2025) is the
    benchmark they are revised against.</p>
  </div>
  <p>Found a mistake? The figures on this page were compiled in November 2026 from the sources
  listed above. Where a source has since revised a figure, the revised value wins.</p>
</section>`;
}

export function missing() {
  return `<div class="notfound">
  <p class="eyebrow">Page not found</p>
  <h1>There is no page at this address</h1>
  <p>Try one of the sections above, or start again from the overview.</p>
  <p><a class="btn" href="#/" style="text-decoration:none">Back to overview</a></p>
</div>`;
}
