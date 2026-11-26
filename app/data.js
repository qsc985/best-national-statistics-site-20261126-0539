// Japan Stat Atlas — the figures behind the site.
//
// Every number here comes from a named public source and year, shown next to
// it on the page. Populations are the Statistics Bureau's census counts and
// October estimates; the economy figures are the IMF and the Cabinet Office;
// trade is the Ministry of Finance; labour is the Statistics Bureau and the
// Ministry of Health, Labour and Welfare. Where a figure is rounded, the page
// says so. Nothing here is fetched: the whole site runs from these files.

window.JAPAN_DATA = {
  country: 'Japan',
  updated: 'November 2026',

  // Headline indicators shown on the overview page.
  headline: [
    { label: 'Population', value: '124.1m', note: 'October 2024 estimate', source: 'Statistics Bureau of Japan, 2024' },
    { label: 'Nominal GDP', value: '$4.03tn', note: 'US dollars, current prices', source: 'IMF World Economic Outlook, 2024' },
    { label: 'GDP per person', value: '$32,400', note: 'US dollars, current prices', source: 'IMF World Economic Outlook, 2024' },
    { label: 'Unemployment rate', value: '2.5%', note: 'Annual average, seasonally adjusted', source: 'Statistics Bureau of Japan, 2024' },
    { label: 'Consumer prices', value: '+2.7%', note: 'All-items CPI, year on year', source: 'Statistics Bureau of Japan, 2024' },
    { label: 'Life expectancy', value: '84.0 years', note: 'Men 81.1, women 87.1', source: 'Ministry of Health, Labour and Welfare, 2024' },
  ],

  // Latest releases: reference period plus the publishing office. No release
  // date is claimed; the period is what a reader needs to find the release.
  releases: [
    { title: 'Consumer Price Index — October 2026', source: 'Statistics Bureau of Japan', route: '#/labour' },
    { title: 'Labour Force Survey — October 2026', source: 'Statistics Bureau of Japan', route: '#/labour' },
    { title: 'Gross Domestic Product — July–September 2026', source: 'Cabinet Office', route: '#/economy' },
    { title: 'Population Estimates — October 2026', source: 'Statistics Bureau of Japan', route: '#/population' },
    { title: 'Trade Statistics — October 2026', source: 'Ministry of Finance', route: '#/economy' },
    { title: 'Monthly Labour Survey — September 2026', source: 'Ministry of Health, Labour and Welfare', route: '#/labour' },
  ],

  // Total population by census year and the latest estimate, millions.
  // Source: Statistics Bureau of Japan, Population Census and estimates.
  populationByYear: [
    { year: 1950, pop: 83.2 }, { year: 1960, pop: 94.3 }, { year: 1970, pop: 104.3 },
    { year: 1980, pop: 117.1 }, { year: 1990, pop: 123.6 }, { year: 2000, pop: 126.9 },
    { year: 2010, pop: 128.1 }, { year: 2015, pop: 127.1 }, { year: 2020, pop: 126.2 },
    { year: 2024, pop: 124.1 },
  ],

  // Age structure, 2024. Source: Statistics Bureau of Japan, October 2024.
  ageStructure: [
    { group: 'Ages 0–14', pop: 13.9, share: 11.2 },
    { group: 'Ages 15–64', pop: 73.8, share: 59.5 },
    { group: 'Ages 65 and over', pop: 36.4, share: 29.3 },
  ],

  // All 47 prefectures. Population: October 2024 estimate, millions.
  // Area: square kilometres (Geospatial Information Authority of Japan).
  // Source for population: Statistics Bureau of Japan, 2024.
  prefectures: [
    { name: 'Hokkaido', capital: 'Sapporo', region: 'Hokkaido', pop: 5.15, area: 83424 },
    { name: 'Aomori', capital: 'Aomori', region: 'Tohoku', pop: 1.19, area: 9646 },
    { name: 'Iwate', capital: 'Morioka', region: 'Tohoku', pop: 1.16, area: 15275 },
    { name: 'Miyagi', capital: 'Sendai', region: 'Tohoku', pop: 2.29, area: 7282 },
    { name: 'Akita', capital: 'Akita', region: 'Tohoku', pop: 0.91, area: 11638 },
    { name: 'Yamagata', capital: 'Yamagata', region: 'Tohoku', pop: 1.02, area: 9323 },
    { name: 'Fukushima', capital: 'Fukushima', region: 'Tohoku', pop: 1.77, area: 13784 },
    { name: 'Ibaraki', capital: 'Mito', region: 'Kanto', pop: 2.85, area: 6097 },
    { name: 'Tochigi', capital: 'Utsunomiya', region: 'Kanto', pop: 1.91, area: 6408 },
    { name: 'Gunma', capital: 'Maebashi', region: 'Kanto', pop: 1.91, area: 6362 },
    { name: 'Saitama', capital: 'Saitama', region: 'Kanto', pop: 7.34, area: 3798 },
    { name: 'Chiba', capital: 'Chiba', region: 'Kanto', pop: 6.28, area: 5158 },
    { name: 'Tokyo', capital: 'Tokyo', region: 'Kanto', pop: 14.18, area: 2194 },
    { name: 'Kanagawa', capital: 'Yokohama', region: 'Kanto', pop: 9.24, area: 2416 },
    { name: 'Niigata', capital: 'Niigata', region: 'Chubu', pop: 2.14, area: 12584 },
    { name: 'Toyama', capital: 'Toyama', region: 'Chubu', pop: 1.00, area: 4248 },
    { name: 'Ishikawa', capital: 'Kanazawa', region: 'Chubu', pop: 1.11, area: 4186 },
    { name: 'Fukui', capital: 'Fukui', region: 'Chubu', pop: 0.74, area: 4191 },
    { name: 'Yamanashi', capital: 'Kofu', region: 'Chubu', pop: 0.80, area: 4465 },
    { name: 'Nagano', capital: 'Nagano', region: 'Chubu', pop: 2.02, area: 13562 },
    { name: 'Gifu', capital: 'Gifu', region: 'Chubu', pop: 1.94, area: 10621 },
    { name: 'Shizuoka', capital: 'Shizuoka', region: 'Chubu', pop: 3.53, area: 7777 },
    { name: 'Aichi', capital: 'Nagoya', region: 'Chubu', pop: 7.52, area: 5173 },
    { name: 'Mie', capital: 'Tsu', region: 'Kinki', pop: 1.73, area: 5774 },
    { name: 'Shiga', capital: 'Otsu', region: 'Kinki', pop: 1.41, area: 4017 },
    { name: 'Kyoto', capital: 'Kyoto', region: 'Kinki', pop: 2.56, area: 4613 },
    { name: 'Osaka', capital: 'Osaka', region: 'Kinki', pop: 8.81, area: 1905 },
    { name: 'Hyogo', capital: 'Kobe', region: 'Kinki', pop: 5.40, area: 8401 },
    { name: 'Nara', capital: 'Nara', region: 'Kinki', pop: 1.30, area: 3691 },
    { name: 'Wakayama', capital: 'Wakayama', region: 'Kinki', pop: 0.89, area: 4726 },
    { name: 'Tottori', capital: 'Tottori', region: 'Chugoku', pop: 0.54, area: 3507 },
    { name: 'Shimane', capital: 'Matsue', region: 'Chugoku', pop: 0.65, area: 6708 },
    { name: 'Okayama', capital: 'Okayama', region: 'Chugoku', pop: 1.86, area: 7115 },
    { name: 'Hiroshima', capital: 'Hiroshima', region: 'Chugoku', pop: 2.75, area: 8479 },
    { name: 'Yamaguchi', capital: 'Yamaguchi', region: 'Chugoku', pop: 1.29, area: 6112 },
    { name: 'Tokushima', capital: 'Tokushima', region: 'Shikoku', pop: 0.68, area: 4147 },
    { name: 'Kagawa', capital: 'Takamatsu', region: 'Shikoku', pop: 0.92, area: 1877 },
    { name: 'Ehime', capital: 'Matsuyama', region: 'Shikoku', pop: 1.28, area: 5676 },
    { name: 'Kochi', capital: 'Kochi', region: 'Shikoku', pop: 0.67, area: 7104 },
    { name: 'Fukuoka', capital: 'Fukuoka', region: 'Kyushu', pop: 5.10, area: 4986 },
    { name: 'Saga', capital: 'Saga', region: 'Kyushu', pop: 0.80, area: 2441 },
    { name: 'Nagasaki', capital: 'Nagasaki', region: 'Kyushu', pop: 1.26, area: 4131 },
    { name: 'Kumamoto', capital: 'Kumamoto', region: 'Kyushu', pop: 1.71, area: 7409 },
    { name: 'Oita', capital: 'Oita', region: 'Kyushu', pop: 1.09, area: 6341 },
    { name: 'Miyazaki', capital: 'Miyazaki', region: 'Kyushu', pop: 1.05, area: 7735 },
    { name: 'Kagoshima', capital: 'Kagoshima', region: 'Kyushu', pop: 1.55, area: 9187 },
    { name: 'Okinawa', capital: 'Naha', region: 'Kyushu', pop: 1.47, area: 2281 },
  ],

  // Real GDP growth, percent year on year. Source: Cabinet Office, 2019–2024.
  gdpGrowth: [
    { year: 2019, growth: -0.4 }, { year: 2020, growth: -4.2 }, { year: 2021, growth: 2.7 },
    { year: 2022, growth: 0.9 }, { year: 2023, growth: 1.7 }, { year: 2024, growth: 0.1 },
  ],

  // Shares of gross value added, 2023. Source: World Bank, World Development
  // Indicators (agriculture, industry, services as % of GDP), rounded.
  gdpStructure: [
    { sector: 'Services', share: 71.0 },
    { sector: 'Industry', share: 28.0 },
    { sector: 'Agriculture, forestry and fishing', share: 1.0 },
  ],

  // Trade in goods, 2024. Source: Ministry of Finance, Trade Statistics.
  trade: {
    exports: 107.9, imports: 112.6, balance: -4.7, unit: '¥ trillion',
    partners: [
      { country: 'United States', exports: 21.3, share: 19.8 },
      { country: 'China', exports: 18.9, share: 17.5 },
      { country: 'South Korea', exports: 7.0, share: 6.5 },
      { country: 'Taiwan', exports: 5.9, share: 5.5 },
      { country: 'Hong Kong', exports: 4.3, share: 4.0 },
      { country: 'Thailand', exports: 4.1, share: 3.8 },
      { country: 'Germany', exports: 3.0, share: 2.8 },
      { country: 'Singapore', exports: 2.9, share: 2.7 },
    ],
  },

  // Unemployment rate, annual average, percent. Source: Statistics Bureau.
  unemployment: [
    { year: 2015, rate: 3.4 }, { year: 2018, rate: 2.4 }, { year: 2019, rate: 2.4 },
    { year: 2020, rate: 2.8 }, { year: 2021, rate: 2.8 }, { year: 2022, rate: 2.6 },
    { year: 2023, rate: 2.6 }, { year: 2024, rate: 2.5 },
  ],

  // All-items CPI, percent change year on year. Source: Statistics Bureau.
  cpi: [
    { year: 2019, change: 0.5 }, { year: 2020, change: 0.0 }, { year: 2021, change: -0.2 },
    { year: 2022, change: 2.5 }, { year: 2023, change: 3.3 }, { year: 2024, change: 2.7 },
  ],

  // Earnings. Source: Ministry of Health, Labour and Welfare, Monthly
  // Labour Survey, 2024 annual average.
  wages: { monthlyCashEarnings: 337000, currency: '¥ per month', source: 'Ministry of Health, Labour and Welfare, 2024' },

  // Typical one-bedroom rent in the city centre, indicative 2025 ranges
  // from major housing portals, rounded to the nearest ¥5,000.
  cityPrices: [
    { city: 'Tokyo', rent: 150000, meal: 1200, pass: 11000 },
    { city: 'Osaka', rent: 95000, meal: 1000, pass: 9000 },
    { city: 'Nagoya', rent: 80000, meal: 1000, pass: 9000 },
    { city: 'Fukuoka', rent: 70000, meal: 900, pass: 8000 },
    { city: 'Sendai', rent: 70000, meal: 900, pass: 8000 },
    { city: 'Hiroshima', rent: 70000, meal: 900, pass: 8000 },
    { city: 'Sapporo', rent: 65000, meal: 900, pass: 8000 },
  ],

  // Largest cities, 2024 estimates, millions. Source: Statistics Bureau.
  largestCities: [
    { city: 'Tokyo (23 special wards)', pop: 9.73 },
    { city: 'Yokohama', pop: 3.77 },
    { city: 'Osaka', pop: 2.75 },
    { city: 'Nagoya', pop: 2.33 },
    { city: 'Sapporo', pop: 1.97 },
    { city: 'Fukuoka', pop: 1.65 },
    { city: 'Kawasaki', pop: 1.54 },
    { city: 'Kobe', pop: 1.52 },
    { city: 'Kyoto', pop: 1.46 },
    { city: 'Saitama', pop: 1.33 },
  ],
};
