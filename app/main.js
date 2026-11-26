// Japan Stat Atlas — router and controls. Hash routes, one per section:
//
//   #/                overview
//   #/population      population, prefectures, annual figures
//   #/economy         growth / structure / trade tabs
//   #/labour          labour market and prices
//   #/regions         regions and prefecture picker
//   #/data            indicators by year, CSV download, sources
//
// Controls are wired by delegation on #app, so a re-render never loses them.
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { PREFECTURES, SERIES, YEARS } from './data.js';
import { dataPage, economy, labour, missing, overview, population, regions } from './views.js';

const app = document.getElementById('app');

const state = {
  year: 2024,
  search: '',
  regionFilter: 'All regions',
  sortKey: 'population',
  sortDir: 'desc',
  econTab: 'growth',
  prefecture: 'Tokyo',
};

const TITLES = {
  overview: 'Japan Stat Atlas — National Statistics of Japan',
  population: 'Population | Japan Stat Atlas',
  economy: 'Economy | Japan Stat Atlas',
  labour: 'Labour & Prices | Japan Stat Atlas',
  regions: 'Regions | Japan Stat Atlas',
  data: 'Data & Sources | Japan Stat Atlas',
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  return hash.split('/')[0] || 'overview';
}

// Only a route change scrolls to the top. Re-renders caused by a control
// (typing in the search box, sorting a column, switching a tab) keep the
// visitor where they are, otherwise every keystroke would jump the page up.
function render(scrollToTop = true) {
  window.__shotReady = false;
  const page = route();
  const pages = { overview, population, economy, labour, regions, data: dataPage };
  const view = pages[page];
  document.title = TITLES[page] ?? 'Japan Stat Atlas';
  app.innerHTML = view ? view(state) : missing();
  document
    .querySelectorAll('.main-nav a')
    .forEach((a) => a.classList.toggle('active', a.dataset.nav === page));
  if (scrollToTop) window.scrollTo(0, 0);
  window.__shotReady = true;
}

function downloadCsv() {
  const lines = ['indicator,year,value,unit,source'];
  const meta = {
    population: ['Population', 'million people', 'Statistics Bureau of Japan'],
    gdp: ['GDP nominal', 'US$ trillion', 'World Bank / IMF'],
    growth: ['Real GDP growth', '% per year', 'World Bank'],
    cpi: ['Consumer price inflation', '% per year', 'Statistics Bureau of Japan'],
    unemployment: ['Unemployment rate', '% of labour force', 'Statistics Bureau of Japan'],
  };
  for (const key of Object.keys(SERIES)) {
    const [name, unit, source] = meta[key];
    YEARS.forEach((y, i) => {
      lines.push(`"${name}",${y},${SERIES[key].values[i]},"${unit}","${source}"`);
    });
  }
  lines.push('');
  lines.push('prefecture,region,capital,population_millions,area_km2');
  for (const p of PREFECTURES) {
    lines.push(`"${p.name}","${p.region}","${p.capital}",${p.population},${p.area}`);
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'japan-stat-atlas-data.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// One delegated listener for every control on every page.
app.addEventListener('change', (event) => {
  const el = event.target.closest('[data-control]');
  if (!el) return;
  const kind = el.dataset.control;
  if (kind === 'year') state.year = Number(el.value);
  if (kind === 'regionFilter') state.regionFilter = el.value;
  if (kind === 'prefecture') state.prefecture = el.value;
  render(false);
});

app.addEventListener('input', (event) => {
  const el = event.target.closest('[data-control="search"]');
  if (!el) return;
  state.search = el.value;
  // Re-render only the table body and count, keeping focus in the search box.
  render(false);
  const box = document.querySelector('[data-control="search"]');
  if (box) {
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
  }
});

app.addEventListener('click', (event) => {
  const sort = event.target.closest('[data-sort]');
  if (sort) {
    const key = sort.dataset.sort;
    if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    else {
      state.sortKey = key;
      state.sortDir = key === 'name' || key === 'region' || key === 'capital' ? 'asc' : 'desc';
    }
    render(false);
    return;
  }
  const tab = event.target.closest('[data-tab]');
  if (tab) {
    state.econTab = tab.dataset.tab;
    render(false);
    return;
  }
  const action = event.target.closest('[data-action="download-csv"]');
  if (action) downloadCsv();
});

window.addEventListener('hashchange', () => render(true));
render();
