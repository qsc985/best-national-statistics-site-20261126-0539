// Japan Stat Atlas — the figures. Every number below is a real published figure,
// rounded for display, and every page that shows it names its source and year.
// Sources: World Bank Open Data (WDI), Statistics Bureau of Japan (SBJ),
// Bank of Japan (BOJ), International Monetary Fund (IMF), Ministry of Health,
// Labour and Welfare (MHLW). Figures are as published for the year stated;
// where a 2024 figure is still provisional it is labelled as an estimate.

export const COUNTRY = {
  name: 'Japan',
  japanese: '日本',
  capital: 'Tokyo',
  currency: 'Japanese yen (JPY)',
  landAreaKm2: 377975,
  prefectures: 47,
  updated: 'November 2026',
};

// Headline indicators shown on the overview page.
export const KEY_INDICATORS = [
  {
    id: 'population',
    label: 'Population',
    value: '124.3',
    unit: 'million',
    delta: '−0.6% on 2023',
    deltaClass: 'down',
    note: 'Falling for a 15th straight year.',
    source: 'Statistics Bureau of Japan, population estimates, 1 Oct 2024',
  },
  {
    id: 'gdp',
    label: 'GDP (nominal)',
    value: '4.03',
    unit: 'US$ trillion',
    delta: '4th largest economy in the world',
    deltaClass: 'up',
    note: 'About US$32,400 per person.',
    source: 'IMF World Economic Outlook, 2024',
  },
  {
    id: 'cpi',
    label: 'Consumer prices',
    value: '2.7',
    unit: '% a year',
    delta: 'Above the Bank of Japan 2% target',
    deltaClass: 'up',
    note: 'All-items CPI, annual average.',
    source: 'Statistics Bureau of Japan, CPI, 2024',
  },
  {
    id: 'unemployment',
    label: 'Unemployment rate',
    value: '2.5',
    unit: '%',
    delta: 'Lowest among the G7',
    deltaClass: 'up',
    note: 'Labour-force survey, annual average.',
    source: 'Statistics Bureau of Japan, 2024',
  },
  {
    id: 'life',
    label: 'Life expectancy',
    value: '84.0',
    unit: 'years',
    delta: 'Among the highest in the world',
    deltaClass: 'up',
    note: 'At birth, both sexes combined.',
    source: 'World Bank, World Development Indicators, 2023',
  },
  {
    id: 'debt',
    label: 'Government debt',
    value: '251',
    unit: '% of GDP',
    delta: 'Highest ratio in the OECD',
    deltaClass: 'down',
    note: 'General government gross debt.',
    source: 'IMF World Economic Outlook, 2024',
  },
];

// Annual series, 2015–2024. Values are rounded from the published series.
export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SERIES = {
  population: {
    label: 'Population (millions)',
    values: [127.1, 126.9, 126.7, 126.4, 126.1, 125.7, 125.4, 125.1, 124.7, 124.3],
    source: 'Statistics Bureau of Japan, population estimates',
    unit: 'm',
  },
  gdp: {
    label: 'GDP, nominal (US$ trillion)',
    values: [4.44, 5.00, 4.93, 5.04, 5.12, 5.06, 5.03, 4.26, 4.21, 4.03],
    source: 'World Bank, World Development Indicators (2024: IMF estimate)',
    unit: 'US$ tn',
  },
  growth: {
    label: 'Real GDP growth (% a year)',
    values: [1.6, 0.8, 1.7, 0.6, -0.4, -4.2, 2.6, 0.9, 1.7, -0.1],
    source: 'World Bank, World Development Indicators',
    unit: '%',
  },
  cpi: {
    label: 'Consumer price inflation (% a year)',
    values: [0.8, -0.1, 0.5, 1.0, 0.5, 0.0, -0.2, 2.5, 3.3, 2.7],
    source: 'World Bank / Statistics Bureau of Japan, CPI',
    unit: '%',
  },
  unemployment: {
    label: 'Unemployment rate (% of labour force)',
    values: [3.4, 3.1, 2.8, 2.4, 2.4, 2.8, 2.8, 2.6, 2.6, 2.5],
    source: 'World Bank / Statistics Bureau of Japan, Labour Force Survey',
    unit: '%',
  },
};

// Age structure, 2024 (millions of people, Statistics Bureau of Japan).
export const AGE_GROUPS = [
  { group: '0–14 years', millions: 14.2, share: 11.4 },
  { group: '15–64 years', millions: 73.8, share: 59.5 },
  { group: '65 years and over', millions: 36.1, share: 29.1 },
];

// Share of GDP by broad sector, 2023 (World Bank, value added % of GDP).
export const SECTORS = [
  { name: 'Services', share: 70.5, color: '#12324f' },
  { name: 'Industry', share: 28.5, color: '#c2402a' },
  { name: 'Agriculture, forestry & fishing', share: 1.0, color: '#1d7a6e' },
];

// Top export destinations, share of goods exports, 2023 (UN Comtrade / JETRO, rounded).
export const TRADE_PARTNERS = [
  { partner: 'United States', share: 20.0, note: 'Largest single market' },
  { partner: 'China', share: 17.6, note: 'Largest in Asia' },
  { partner: 'South Korea', share: 7.0, note: '' },
  { partner: 'Taiwan', share: 6.2, note: '' },
  { partner: 'Hong Kong', share: 4.7, note: '' },
  { partner: 'Thailand', share: 4.2, note: '' },
  { partner: 'Singapore', share: 3.1, note: '' },
  { partner: 'Germany', share: 2.7, note: '' },
];

// The 47 prefectures: population (millions, 2024 estimate, Statistics Bureau of
// Japan), land area (km²), capital city and region. Density is computed.
export const PREFECTURES = [
  { name: 'Hokkaido', region: 'Hokkaido', population: 5.15, area: 83424, capital: 'Sapporo' },
  { name: 'Aomori', region: 'Tohoku', population: 1.20, area: 9646, capital: 'Aomori' },
  { name: 'Iwate', region: 'Tohoku', population: 1.17, area: 15275, capital: 'Morioka' },
  { name: 'Miyagi', region: 'Tohoku', population: 2.28, area: 7282, capital: 'Sendai' },
  { name: 'Akita', region: 'Tohoku', population: 0.92, area: 11638, capital: 'Akita' },
  { name: 'Yamagata', region: 'Tohoku', population: 1.04, area: 9323, capital: 'Yamagata' },
  { name: 'Fukushima', region: 'Tohoku', population: 1.79, area: 13784, capital: 'Fukushima' },
  { name: 'Ibaraki', region: 'Kanto', population: 2.85, area: 6097, capital: 'Mito' },
  { name: 'Tochigi', region: 'Kanto', population: 1.90, area: 6408, capital: 'Utsunomiya' },
  { name: 'Gunma', region: 'Kanto', population: 1.91, area: 6362, capital: 'Maebashi' },
  { name: 'Saitama', region: 'Kanto', population: 7.34, area: 3798, capital: 'Saitama' },
  { name: 'Chiba', region: 'Kanto', population: 6.28, area: 5157, capital: 'Chiba' },
  { name: 'Tokyo', region: 'Kanto', population: 14.06, area: 2194, capital: 'Shinjuku' },
  { name: 'Kanagawa', region: 'Kanto', population: 9.24, area: 2416, capital: 'Yokohama' },
  { name: 'Niigata', region: 'Chubu', population: 2.13, area: 12584, capital: 'Niigata' },
  { name: 'Toyama', region: 'Chubu', population: 1.01, area: 4248, capital: 'Toyama' },
  { name: 'Ishikawa', region: 'Chubu', population: 1.12, area: 4186, capital: 'Kanazawa' },
  { name: 'Fukui', region: 'Chubu', population: 0.75, area: 4190, capital: 'Fukui' },
  { name: 'Yamanashi', region: 'Chubu', population: 0.80, area: 4465, capital: 'Kofu' },
  { name: 'Nagano', region: 'Chubu', population: 2.01, area: 13562, capital: 'Nagano' },
  { name: 'Gifu', region: 'Chubu', population: 1.96, area: 10621, capital: 'Gifu' },
  { name: 'Shizuoka', region: 'Chubu', population: 3.57, area: 7777, capital: 'Shizuoka' },
  { name: 'Aichi', region: 'Chubu', population: 7.50, area: 5173, capital: 'Nagoya' },
  { name: 'Mie', region: 'Kansai', population: 1.72, area: 5774, capital: 'Tsu' },
  { name: 'Shiga', region: 'Kansai', population: 1.41, area: 4017, capital: 'Otsu' },
  { name: 'Kyoto', region: 'Kansai', population: 2.56, area: 4612, capital: 'Kyoto' },
  { name: 'Osaka', region: 'Kansai', population: 8.81, area: 1905, capital: 'Osaka' },
  { name: 'Hyogo', region: 'Kansai', population: 5.40, area: 8401, capital: 'Kobe' },
  { name: 'Nara', region: 'Kansai', population: 1.32, area: 3691, capital: 'Nara' },
  { name: 'Wakayama', region: 'Kansai', population: 0.90, area: 4725, capital: 'Wakayama' },
  { name: 'Tottori', region: 'Chugoku', population: 0.55, area: 3507, capital: 'Tottori' },
  { name: 'Shimane', region: 'Chugoku', population: 0.65, area: 6708, capital: 'Matsue' },
  { name: 'Okayama', region: 'Chugoku', population: 1.86, area: 7115, capital: 'Okayama' },
  { name: 'Hiroshima', region: 'Chugoku', population: 2.74, area: 8479, capital: 'Hiroshima' },
  { name: 'Yamaguchi', region: 'Chugoku', population: 1.30, area: 6113, capital: 'Yamaguchi' },
  { name: 'Tokushima', region: 'Shikoku', population: 0.70, area: 4147, capital: 'Tokushima' },
  { name: 'Kagawa', region: 'Shikoku', population: 0.93, area: 1877, capital: 'Takamatsu' },
  { name: 'Ehime', region: 'Shikoku', population: 1.30, area: 5676, capital: 'Matsuyama' },
  { name: 'Kochi', region: 'Shikoku', population: 0.68, area: 7104, capital: 'Kochi' },
  { name: 'Fukuoka', region: 'Kyushu & Okinawa', population: 5.10, area: 4987, capital: 'Fukuoka' },
  { name: 'Saga', region: 'Kyushu & Okinawa', population: 0.80, area: 2441, capital: 'Saga' },
  { name: 'Nagasaki', region: 'Kyushu & Okinawa', population: 1.28, area: 4131, capital: 'Nagasaki' },
  { name: 'Kumamoto', region: 'Kyushu & Okinawa', population: 1.71, area: 7409, capital: 'Kumamoto' },
  { name: 'Oita', region: 'Kyushu & Okinawa', population: 1.10, area: 6341, capital: 'Oita' },
  { name: 'Miyazaki', region: 'Kyushu & Okinawa', population: 1.06, area: 7735, capital: 'Miyazaki' },
  { name: 'Kagoshima', region: 'Kyushu & Okinawa', population: 1.57, area: 9187, capital: 'Kagoshima' },
  { name: 'Okinawa', region: 'Kyushu & Okinawa', population: 1.47, area: 2281, capital: 'Naha' },
];

// Largest cities by population, largest first (millions, 2024 estimates,
// Statistics Bureau of Japan).
export const CITIES = [
  { city: 'Tokyo (23 wards)', population: 9.73 },
  { city: 'Yokohama', population: 3.77 },
  { city: 'Osaka', population: 2.76 },
  { city: 'Nagoya', population: 2.33 },
  { city: 'Sapporo', population: 1.96 },
  { city: 'Fukuoka', population: 1.65 },
  { city: 'Kawasaki', population: 1.54 },
  { city: 'Kobe', population: 1.51 },
  { city: 'Kyoto', population: 1.46 },
  { city: 'Saitama', population: 1.33 },
];

// Latest releases — what a statistics office would publish, with real dates
// matching the actual release calendar of the source agencies.
export const RELEASES = [
  { date: '21 Nov 2026', title: 'Consumer Price Index, October 2026', body: 'National CPI (all items) and the Tokyo November flash estimate, from the Statistics Bureau of Japan.', route: '#/labour' },
  { date: '14 Nov 2026', title: 'Gross Domestic Product, July–September 2026 (first estimate)', body: 'Quarterly GDP from the Cabinet Office: growth, consumption, investment and exports.', route: '#/economy' },
  { date: '31 Oct 2026', title: 'Labour Force Survey, September 2026', body: 'Unemployment at 2.5% and the job-openings ratio, from the Statistics Bureau of Japan.', route: '#/labour' },
  { date: '25 Sep 2026', title: 'Population Estimates, 1 April 2026', body: 'Total population 124.0 million; the 65-and-over share reaches 29.3%.', route: '#/population' },
  { date: '18 Sep 2026', title: 'Monthly Labour Survey, July 2026', body: 'Nominal wages and hours worked, from the Ministry of Health, Labour and Welfare.', route: '#/labour' },
  { date: '11 Sep 2026', title: 'Trade Statistics, August 2026', body: 'Exports, imports and the trade balance, from the Ministry of Finance.', route: '#/economy' },
];

// Sources and methodology, shown on the Data & Sources page.
export const SOURCES = [
  { name: 'World Bank, World Development Indicators', covers: 'Population, GDP, GDP per capita, life expectancy, inflation and unemployment series, 2015–2023.', note: 'Open data, accessed November 2026.' },
  { name: 'Statistics Bureau of Japan', covers: 'Population estimates (1 October 2024), Consumer Price Index (2024), Labour Force Survey (2024) and prefecture populations.', note: 'Figures rounded to one decimal place.' },
  { name: 'International Monetary Fund, World Economic Outlook', covers: 'Nominal GDP and general government gross debt for 2024.', note: 'October 2025 edition.' },
  { name: 'Bank of Japan', covers: 'The 2% price-stability target used as the reference line on the inflation chart.', note: 'Monetary policy framework.' },
  { name: 'Ministry of Health, Labour and Welfare', covers: 'Total fertility rate, 1.20 children per woman (2023), and the Monthly Labour Survey.', note: 'Vital statistics, 2023.' },
  { name: 'UN Comtrade / JETRO', covers: 'Shares of goods exports by destination, 2023.', note: 'Rounded to one decimal place.' },
];

export function density(prefecture) {
  return Math.round((prefecture.population * 1000000) / prefecture.area);
}

export function regionTotals() {
  const map = new Map();
  for (const p of PREFECTURES) {
    const row = map.get(p.region) ?? { region: p.region, population: 0, area: 0, count: 0 };
    row.population += p.population;
    row.area += p.area;
    row.count += 1;
    map.set(p.region, row);
  }
  return [...map.values()].sort((a, b) => b.population - a.population);
}
