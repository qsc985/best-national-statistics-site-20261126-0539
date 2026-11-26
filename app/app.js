// Japan Stat Atlas — the site itself.
//
// One page, hash routes, no network: every view is rendered from the figures
// in data.js and the SVG builders in charts.js. The routes are:
//   #/            Overview        #/labour   Labour & Prices
//   #/population  Population      #/regions   Regions
//   #/economy     Economy         #/data      Data & Sources
// A route the site does not know shows a short "no page" note.

(function () {
  var D = window.JAPAN_DATA;
  var C = window.ATLAS_CHARTS;

  var ROUTES = ['', 'population', 'economy', 'labour', 'regions', 'data'];
  var NAV = [
    { route: '', label: 'Overview' },
    { route: 'population', label: 'Population' },
    { route: 'economy', label: 'Economy' },
    { route: 'labour', label: 'Labour & Prices' },
    { route: 'regions', label: 'Regions' },
    { route: 'data', label: 'Data & Sources' },
  ];

  var prefSort = { key: 'name', dir: 1 };
  var economyTab = 'growth';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function fmtMillions(v) { return v.toFixed(2) + 'm'; }
  function fmtInt(v) { return Math.round(v).toLocaleString('en-US'); }
  function fmtYen(v) { return '¥' + Math.round(v).toLocaleString('en-US'); }
  function density(p) { return (p.pop * 1000000) / p.area; }
  function sourceLine(text) { return '<p class="source">Source: ' + esc(text) + '</p>'; }

  function pageHead(eyebrow, title, intro) {
    return '<div class="page-head"><div class="eyebrow">' + esc(eyebrow) + '</div>' +
      '<h2>' + esc(title) + '</h2><p>' + esc(intro) + '</p></div>';
  }

  function card(title, sub, inner) {
    return '<section class="card"><h3>' + esc(title) + '</h3>' +
      (sub ? '<p class="sub">' + esc(sub) + '</p>' : '') + inner + '</section>';
  }

  // --- Overview ------------------------------------------------------------
  function renderOverview() {
    var kpis = D.headline.map(function (k) {
      return '<article class="kpi"><div class="k-label">' + esc(k.label) + '</div>' +
        '<div class="k-value">' + esc(k.value) + '</div>' +
        '<div class="k-note">' + esc(k.note) + '</div>' +
        '<div class="k-source">' + esc(k.source) + '</div></article>';
    }).join('');

    var releases = D.releases.map(function (r) {
      return '<li><a href="' + esc(r.route) + '">' + esc(r.title) + '</a>' +
        '<span class="rel-source">' + esc(r.source) + '</span></li>';
    }).join('');

    return pageHead('Japan · National statistics', 'Japan Stat Atlas',
      'The figures that describe Japan — how many people live here, how the economy is doing, what work pays and what things cost — each with its source and year.') +
      '<div class="kpi-grid">' + kpis + '</div>' +
      '<div class="split">' +
      card('Population, 1950–2024', 'Census counts to 2020, estimate for 2024',
        '<div class="chart-wrap">' + C.lineChart(D.populationByYear.map(function (r) {
          return { label: String(r.year), value: r.pop };
        }), { title: 'Total population of Japan, millions', format: fmtMillions }) + '</div>' +
        sourceLine('Statistics Bureau of Japan, Population Census and population estimates.')) +
      card('Real GDP growth', 'Percent change on the previous year',
        '<div class="chart-wrap">' + C.barChart(D.gdpGrowth.map(function (r) {
          return { label: String(r.year), value: r.growth };
        }), { title: 'Real GDP growth, percent', format: function (v) { return (v > 0 ? '+' : '') + v.toFixed(1) + '%'; } }) + '</div>' +
        sourceLine('Cabinet Office, National Accounts, 2019–2024.')) +
      '</div>' +
      card('Latest releases', 'The newest figures, by reference period',
        '<ul class="release-list">' + releases + '</ul>' +
        '<p class="source">Each release links to the section that explains it. Figures are published by the offices named; this site republishes them with their sources.</p>');
  }

  // --- Population ----------------------------------------------------------
  function prefRows(list) {
    return list.map(function (p) {
      return '<tr><td>' + esc(p.name) + '</td><td>' + esc(p.capital) + '</td><td>' + esc(p.region) +
        '</td><td class="num">' + p.pop.toFixed(2) + '</td><td class="num">' + fmtInt(p.area) +
        '</td><td class="num">' + fmtInt(density(p)) + '</td></tr>';
    }).join('');
  }

  function sortedPrefs() {
    var list = D.prefectures.slice();
    var key = prefSort.key, dir = prefSort.dir;
    list.sort(function (a, b) {
      var va = key === 'density' ? density(a) : a[key];
      var vb = key === 'density' ? density(b) : b[key];
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return list;
  }

  function renderPopulation() {
    var regions = ['All regions'].concat(Array.from(new Set(D.prefectures.map(function (p) { return p.region; }))));
    var regionOptions = regions.map(function (r) {
      return '<option value="' + esc(r) + '">' + esc(r) + '</option>';
    }).join('');
    var yearOptions = D.populationByYear.map(function (r) {
      return '<option value="' + r.year + '"' + (r.year === 2024 ? ' selected' : '') + '>' + r.year + '</option>';
    }).join('');
    var annualRows = D.populationByYear.map(function (r) {
      var prev = D.populationByYear[D.populationByYear.indexOf(r) - 1];
      var change = prev ? ((r.pop - prev.pop) / prev.pop * 100).toFixed(2) : '—';
      return '<tr data-year="' + r.year + '"' + (r.year === 2024 ? ' style="background:#f3e3d3;font-weight:700"' : '') +
        '><td>' + r.year + '</td><td class="num">' + r.pop.toFixed(1) + '</td><td class="num">' + change + '</td></tr>';
    }).join('');

    return pageHead('People', 'Population',
      'Japan had 124.1 million people in October 2024, down from a peak of 128.1 million in 2010. Nearly three in ten residents are 65 or older.') +
      '<div class="split">' +
      card('Population trend, 1950–2024', 'Millions of people',
        '<div class="chart-wrap">' + C.lineChart(D.populationByYear.map(function (r) {
          return { label: String(r.year), value: r.pop };
        }), { title: 'Total population of Japan, millions', format: fmtMillions }) + '</div>' +
        sourceLine('Statistics Bureau of Japan, Population Census and estimates.')) +
      card('Age structure, 2024', 'Share of the population by age group',
        '<div class="chart-wrap">' + C.hbarChart(D.ageStructure.map(function (a) {
          return { label: a.group, value: a.share };
        }), { title: 'Age structure, percent of population', format: function (v) { return v.toFixed(1) + '%'; } }) + '</div>' +
        '<p>People aged 65 and over number 36.4 million; children under 15 number 13.9 million.</p>' +
        sourceLine('Statistics Bureau of Japan, population estimates, October 2024.')) +
      '</div>' +
      card('All 47 prefectures', 'Population October 2024, area and density — click a column heading to sort',
        '<div class="controls">' +
        '<label>Search prefecture or capital<input type="search" data-control="search" placeholder="Try “Osaka” or “Sendai”" aria-label="Search prefectures"></label>' +
        '<label>Region<select data-control="regionFilter" aria-label="Filter by region">' + regionOptions + '</select></label>' +
        '</div>' +
        '<div class="table-scroll"><table class="data"><caption>Prefectures of Japan</caption><thead><tr>' +
        '<th><button type="button" data-sort="name">Prefecture ↕</button></th>' +
        '<th>Capital</th><th>Region</th>' +
        '<th class="num"><button type="button" data-sort="pop">Population (m) ↕</button></th>' +
        '<th class="num"><button type="button" data-sort="area">Area (km²) ↕</button></th>' +
        '<th class="num"><button type="button" data-sort="density">Density (/km²) ↕</button></th>' +
        '</tr></thead><tbody id="pref-body">' + prefRows(sortedPrefs()) + '</tbody></table></div>' +
        sourceLine('Population: Statistics Bureau of Japan, October 2024 estimates. Area: Geospatial Information Authority of Japan. Density is computed from the two.')) +
      card('Population by year', 'Pick a year to highlight its row',
        '<div class="controls"><label>Highlight year<select id="year-select" aria-label="Highlight a year">' + yearOptions + '</select></label></div>' +
        '<div class="table-scroll"><table class="data"><caption>National population by year</caption><thead><tr>' +
        '<th>Year</th><th class="num">Population (m)</th><th class="num">Change since previous (%)</th>' +
        '</tr></thead><tbody>' + annualRows + '</tbody></table></div>' +
        sourceLine('Statistics Bureau of Japan, Population Census (1950–2020) and estimate (2024).'));
  }

  function applyPrefFilter() {
    var body = document.getElementById('pref-body');
    if (!body) return; // the prefecture table is only on the Population page
    var search = document.querySelector('[data-control="search"]');
    var regionSel = document.querySelector('[data-control="regionFilter"]');
    var q = ((search && search.value) || '').toLowerCase();
    var region = regionSel ? regionSel.value : 'All regions';
    var list = sortedPrefs().filter(function (p) {
      var hit = p.name.toLowerCase().indexOf(q) !== -1 || p.capital.toLowerCase().indexOf(q) !== -1;
      return hit && (region === 'All regions' || p.region === region);
    });
    body.innerHTML = prefRows(list);
  }

  // Highlight one year's row in whichever annual table is on the page.
  function highlightYear(year) {
    document.querySelectorAll('table.data tbody tr[data-year]').forEach(function (tr) {
      var on = tr.getAttribute('data-year') === String(year);
      tr.style.background = on ? '#f3e3d3' : '';
      tr.style.fontWeight = on ? '700' : '';
    });
  }

  // --- Economy -------------------------------------------------------------
  function renderEconomy() {
    var tabs = ['growth', 'structure', 'trade'].map(function (t) {
      var label = t === 'growth' ? 'Growth' : t === 'structure' ? 'Structure' : 'Trade';
      return '<button type="button" role="tab" data-tab="' + t + '" aria-selected="' + (economyTab === t) + '">' + label + '</button>';
    }).join('');
    var body = '';
    if (economyTab === 'growth') {
      body = '<div class="chart-wrap">' + C.barChart(D.gdpGrowth.map(function (r) {
        return { label: String(r.year), value: r.growth };
      }), { title: 'Real GDP growth, percent', format: function (v) { return (v > 0 ? '+' : '') + v.toFixed(1) + '%'; } }) + '</div>' +
        '<p>Nominal GDP was $4.03 trillion in 2024 and GDP per person $32,400 (IMF). The 2020 contraction of 4.2% was the pandemic year; growth has been modest since, at 0.1% in 2024.</p>' +
        sourceLine('Real growth: Cabinet Office, National Accounts. Nominal GDP and GDP per person: IMF World Economic Outlook, 2024.');
    } else if (economyTab === 'structure') {
      var colors = ['#1d2f4e', '#c0392b', '#c9a227'];
      var legend = D.gdpStructure.map(function (s, i) {
        return '<li><span class="swatch" style="background:' + colors[i] + '"></span>' +
          esc(s.sector) + ' — ' + s.share.toFixed(1) + '%</li>';
      }).join('');
      body = '<div class="split"><div class="chart-wrap">' + C.donutChart(
        D.gdpStructure.map(function (s) { return { label: s.sector, value: s.share }; }),
        { title: 'Shares of gross value added', centre: '100%', centreLabel: 'of value added' }) + '</div>' +
        '<div><ul class="legend">' + legend + '</ul>' +
        '<p>Services dominate the economy — retail, finance, transport and public services together make up about seven tenths of value added. Manufacturing is the largest part of industry; agriculture is about one percent.</p></div></div>' +
        sourceLine('World Bank, World Development Indicators, 2023, rounded.');
    } else {
      var partners = D.trade.partners.map(function (p) {
        return '<tr><td>' + esc(p.country) + '</td><td class="num">' + p.exports.toFixed(1) +
          '</td><td class="num">' + p.share.toFixed(1) + '</td></tr>';
      }).join('');
      body = '<p>Japan exported ¥107.9 trillion of goods in 2024 and imported ¥112.6 trillion, a deficit of ¥4.7 trillion. The United States passed China as the largest export market.</p>' +
        '<div class="table-scroll"><table class="data"><caption>Largest export markets, 2024</caption><thead><tr>' +
        '<th>Country</th><th class="num">Exports (¥ trillion)</th><th class="num">Share of exports (%)</th>' +
        '</tr></thead><tbody>' + partners + '</tbody></table></div>' +
        sourceLine('Ministry of Finance, Trade Statistics, 2024. Partner shares are rounded.');
    }
    return pageHead('Money', 'Economy',
      'A $4.03 trillion economy in 2024 — the world’s fourth largest — built mostly on services, exporting cars, machinery and electronics.') +
      '<div class="tabs" role="tablist">' + tabs + '</div>' +
      card(economyTab === 'growth' ? 'Growth' : economyTab === 'structure' ? 'What the economy is made of' : 'Trade in goods',
        economyTab === 'growth' ? 'Real GDP, percent change on the previous year' :
        economyTab === 'structure' ? 'Shares of gross value added, 2023' : 'Goods exports by destination, 2024', body);
  }

  // --- Labour & Prices -----------------------------------------------------
  function renderLabour() {
    var prices = D.cityPrices.map(function (c) {
      return '<tr><td>' + esc(c.city) + '</td><td class="num">' + fmtYen(c.rent) +
        '</td><td class="num">' + fmtYen(c.meal) + '</td><td class="num">' + fmtYen(c.pass) + '</td></tr>';
    }).join('');
    return pageHead('Work and prices', 'Labour & Prices',
      'Unemployment has stayed near 2.5% for years, while prices — flat for decades — rose 2.7% in 2024 after 3.3% in 2023.') +
      '<div class="callout"><p><strong>Average monthly cash earnings: ¥337,000</strong> in 2024 (all industries, regular employees). ' +
      'Source: Ministry of Health, Labour and Welfare, Monthly Labour Survey.</p></div>' +
      '<div class="split">' +
      card('Unemployment rate', 'Annual average, percent',
        '<div class="chart-wrap">' + C.lineChart(D.unemployment.map(function (r) {
          return { label: String(r.year), value: r.rate };
        }), { title: 'Unemployment rate, percent', format: function (v) { return v.toFixed(1) + '%'; } }) + '</div>' +
        sourceLine('Statistics Bureau of Japan, Labour Force Survey.')) +
      card('Consumer prices', 'All-items CPI, percent change on the previous year',
        '<div class="chart-wrap">' + C.barChart(D.cpi.map(function (r) {
          return { label: String(r.year), value: r.change };
        }), { title: 'Consumer price inflation, percent', format: function (v) { return (v > 0 ? '+' : '') + v.toFixed(1) + '%'; } }) + '</div>' +
        sourceLine('Statistics Bureau of Japan, Consumer Price Index.')) +
      '</div>' +
      card('What things cost by city', 'Indicative 2025 figures from major housing portals, rounded',
        '<div class="table-scroll"><table class="data"><caption>Typical monthly costs</caption><thead><tr>' +
        '<th>City</th><th class="num">One-bedroom rent, city centre</th><th class="num">Lunch meal</th><th class="num">Monthly transport pass</th>' +
        '</tr></thead><tbody>' + prices + '</tbody></table></div>' +
        '<p class="source">Rents and meal prices are indicative ranges from major housing and cost-of-living portals, 2025, rounded to the nearest ¥5,000 (rent) and ¥100 (meal, pass). Tokyo costs roughly twice what Sapporo does.</p>');
  }

  // --- Regions -------------------------------------------------------------
  function regionTotals() {
    var order = ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kinki', 'Chugoku', 'Shikoku', 'Kyushu'];
    return order.map(function (r) {
      var total = D.prefectures.filter(function (p) { return p.region === r; })
        .reduce(function (s, p) { return s + p.pop; }, 0);
      return { label: r, value: Math.round(total * 100) / 100 };
    });
  }

  function prefDetail(name) {
    var p = D.prefectures.find(function (x) { return x.name === name; }) || D.prefectures[0];
    return '<div class="stat-strip">' +
      '<div class="stat"><b>' + p.pop.toFixed(2) + 'm</b><span>Population, 2024</span></div>' +
      '<div class="stat"><b>' + fmtInt(p.area) + ' km²</b><span>Area</span></div>' +
      '<div class="stat"><b>' + fmtInt(density(p)) + ' /km²</b><span>Density</span></div>' +
      '<div class="stat"><b>' + esc(p.capital) + '</b><span>Capital · ' + esc(p.region) + '</span></div>' +
      '</div>' +
      '<p>' + esc(p.name) + ' is one of the 47 prefectures, in the ' + esc(p.region) +
      ' region. Its capital is ' + esc(p.capital) + '. Use the Population page to compare it with every other prefecture.</p>';
  }

  function renderRegions() {
    var options = D.prefectures.map(function (p) {
      return '<option value="' + esc(p.name) + '"' + (p.name === 'Tokyo' ? ' selected' : '') + '>' + esc(p.name) + '</option>';
    }).join('');
    var cities = D.largestCities.map(function (c) {
      return '<tr><td>' + esc(c.city) + '</td><td class="num">' + c.pop.toFixed(2) + '</td></tr>';
    }).join('');
    return pageHead('Places', 'Regions',
      'Japan is divided into 47 prefectures in eight regions. A third of the country lives in the greater Tokyo area alone.') +
      card('Population by region', 'Millions of people, 2024',
        '<div class="chart-wrap">' + C.hbarChart(regionTotals(), {
          title: 'Population by region, millions', format: fmtMillions,
        }) + '</div>' +
        sourceLine('Statistics Bureau of Japan, October 2024 estimates, summed by region.')) +
      card('Pick a prefecture', 'Choose one to see its headline figures',
        '<div class="controls"><label>Prefecture<select data-control="prefecture" aria-label="Choose a prefecture">' + options + '</select></label></div>' +
        '<div id="pref-detail">' + prefDetail('Tokyo') + '</div>' +
        sourceLine('Population: Statistics Bureau of Japan, October 2024. Area: Geospatial Information Authority of Japan.')) +
      card('Largest cities', '2024 estimates, millions of people',
        '<div class="table-scroll"><table class="data"><caption>The ten largest cities</caption><thead><tr>' +
        '<th>City</th><th class="num">Population (m)</th></tr></thead><tbody>' + cities + '</tbody></table></div>' +
        sourceLine('Statistics Bureau of Japan, 2024 estimates. Tokyo is the 23 special wards only; the wider metropolitan area holds about 37 million.'));
  }

  // --- Data & Sources ------------------------------------------------------
  function annualSeries() {
    return D.populationByYear.map(function (r) {
      var g = D.gdpGrowth.find(function (x) { return x.year === r.year; });
      var u = D.unemployment.find(function (x) { return x.year === r.year; });
      var c = D.cpi.find(function (x) { return x.year === r.year; });
      return {
        year: r.year, pop: r.pop,
        growth: g ? g.growth : null, unemployment: u ? u.rate : null, cpi: c ? c.change : null,
      };
    });
  }

  function renderData() {
    var rows = annualSeries();
    var yearOptions = rows.map(function (r) {
      return '<option value="' + r.year + '"' + (r.year === 2024 ? ' selected' : '') + '>' + r.year + '</option>';
    }).join('');
    var body = rows.map(function (r) {
      return '<tr data-year="' + r.year + '"' + (r.year === 2024 ? ' style="background:#f3e3d3;font-weight:700"' : '') +
        '><td>' + r.year + '</td><td class="num">' + r.pop.toFixed(1) + '</td><td class="num">' +
        (r.growth === null ? '—' : (r.growth > 0 ? '+' : '') + r.growth.toFixed(1)) + '</td><td class="num">' +
        (r.unemployment === null ? '—' : r.unemployment.toFixed(1)) + '</td><td class="num">' +
        (r.cpi === null ? '—' : (r.cpi > 0 ? '+' : '') + r.cpi.toFixed(1)) + '</td></tr>';
    }).join('');
    return pageHead('The numbers behind the site', 'Data & Sources',
      'Every figure on this site in one table, with a download of the full dataset. Pick a year to highlight its row.') +
      card('Key indicators by year', 'Population in millions; growth, unemployment and CPI in percent',
        '<div class="controls"><label>Highlight year<select id="year-select" aria-label="Highlight a year">' + yearOptions + '</select></label>' +
        '<button type="button" class="action" data-action="download-csv">Download the data (CSV)</button></div>' +
        '<div class="table-scroll"><table class="data"><caption>Key indicators</caption><thead><tr>' +
        '<th>Year</th><th class="num">Population (m)</th><th class="num">Real GDP growth (%)</th>' +
        '<th class="num">Unemployment (%)</th><th class="num">CPI change (%)</th>' +
        '</tr></thead><tbody>' + body + '</tbody></table></div>' +
        '<p class="source">“—” means the series does not cover that year. The CSV download includes this table and all 47 prefectures.</p>') +
      card('Sources and method', 'Where every number comes from',
        '<ul class="release-list">' +
        '<li><span><strong>Population, age structure, unemployment, CPI</strong> — Statistics Bureau of Japan, Population Census, population estimates, Labour Force Survey and Consumer Price Index.</span></li>' +
        '<li><span><strong>National accounts</strong> — Cabinet Office, National Accounts of Japan (real GDP growth).</span></li>' +
        '<li><span><strong>GDP in dollars</strong> — International Monetary Fund, World Economic Outlook, 2024.</span></li>' +
        '<li><span><strong>Trade</strong> — Ministry of Finance, Trade Statistics, 2024.</span></li>' +
        '<li><span><strong>Wages and life expectancy</strong> — Ministry of Health, Labour and Welfare, Monthly Labour Survey and life tables, 2024.</span></li>' +
        '<li><span><strong>Prefecture areas</strong> — Geospatial Information Authority of Japan.</span></li>' +
        '<li><span><strong>Economic structure</strong> — World Bank, World Development Indicators, 2023.</span></li>' +
        '</ul>' +
        '<p>Method notes: populations are census counts except where marked as estimates; growth and CPI are year-on-year percent changes; densities are computed from the published population and area; city prices are indicative ranges, not official statistics, and are labelled as such. Figures are rounded for display; the CSV carries the same rounded values shown on the page.</p>');
  }

  function downloadCsv() {
    var lines = ['indicator,year,value,unit,source'];
    annualSeries().forEach(function (r) {
      lines.push('population,' + r.year + ',' + r.pop.toFixed(1) + ',million people,Statistics Bureau of Japan');
      if (r.growth !== null) lines.push('real GDP growth,' + r.year + ',' + r.growth.toFixed(1) + ',percent,Cabinet Office');
      if (r.unemployment !== null) lines.push('unemployment,' + r.year + ',' + r.unemployment.toFixed(1) + ',percent,Statistics Bureau of Japan');
      if (r.cpi !== null) lines.push('CPI change,' + r.year + ',' + r.cpi.toFixed(1) + ',percent,Statistics Bureau of Japan');
    });
    D.prefectures.forEach(function (p) {
      lines.push('prefecture population,2024,' + p.name + ',' + p.pop.toFixed(2) + ',million people,Statistics Bureau of Japan');
      lines.push('prefecture area,2024,' + p.name + ',' + p.area + ',square km,Geospatial Information Authority of Japan');
    });
    var blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'japan-stat-atlas-data.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // --- Router --------------------------------------------------------------
  function currentRoute() {
    var hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    return ROUTES.indexOf(hash) === -1 ? null : hash;
  }

  function render() {
    var route = currentRoute();
    var view = document.getElementById('view');
    document.querySelectorAll('nav.main a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-route') === (route === null ? '__none__' : route));
    });
    if (route === null) {
      view.innerHTML = pageHead('Not found', 'There is no page here',
        'The link you followed does not name a section of this site. Use the navigation above to explore Japan’s statistics.') +
        '<p><a href="#/">Back to the overview →</a></p>';
    } else if (route === 'population') {
      view.innerHTML = renderPopulation();
    } else if (route === 'economy') {
      view.innerHTML = renderEconomy();
    } else if (route === 'labour') {
      view.innerHTML = renderLabour();
    } else if (route === 'regions') {
      view.innerHTML = renderRegions();
    } else if (route === 'data') {
      view.innerHTML = renderData();
    } else {
      view.innerHTML = renderOverview();
    }
    window.scrollTo(0, 0);
    window.__shotReady = true;
  }

  // --- Wiring: one delegated listener covers every control on every page. --
  document.addEventListener('input', function (e) {
    if (e.target.matches('[data-control="search"]') || e.target.matches('[data-control="regionFilter"]')) applyPrefFilter();
  });
  document.addEventListener('change', function (e) {
    if (e.target.matches('[data-control="regionFilter"]')) applyPrefFilter();
    if (e.target.matches('[data-control="prefecture"]')) {
      document.getElementById('pref-detail').innerHTML = prefDetail(e.target.value);
    }
    if (e.target.id === 'year-select') highlightYear(e.target.value);
  });
  document.addEventListener('click', function (e) {
    var sortBtn = e.target.closest('[data-sort]');
    if (sortBtn) {
      var key = sortBtn.getAttribute('data-sort');
      if (prefSort.key === key) prefSort.dir *= -1;
      else { prefSort.key = key; prefSort.dir = key === 'name' ? 1 : -1; }
      applyPrefFilter();
      return;
    }
    var tabBtn = e.target.closest('[data-tab]');
    if (tabBtn) { economyTab = tabBtn.getAttribute('data-tab'); render(); return; }
    var dlBtn = e.target.closest('[data-action="download-csv"]');
    if (dlBtn) downloadCsv();
  });
  window.addEventListener('hashchange', render);

  render();
})();
