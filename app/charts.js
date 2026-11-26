// Japan Stat Atlas — charts. Every chart is plain inline SVG built from the
// site's own data: no library, no canvas, no network. Each function returns
// an SVG string with a <title> for screen readers and labelled axes.

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const start = Math.floor(min / s) * s;
  const ticks = [];
  for (let v = start; v <= max + s * 0.001; v += s) ticks.push(v);
  return ticks;
}

function fmt(v, decimals = 1) {
  return Number(v).toFixed(decimals).replace(/\.0$/, '');
}

// A line chart with labelled points. `series` is { years, values, label, unit, color }.
// The vertical axis is padded around the data, not forced to zero: a series such
// as population (124–127 million) would otherwise draw as a flat line.
export function lineChart({ years, values, label, unit, color = '#12324f', height = 260 }) {
  const w = 640;
  const h = height;
  const padL = 52;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const lo = min - span * 0.25;
  const hi = max + span * 0.25;
  const x = (i) => padL + ((w - padL - padR) * i) / (years.length - 1);
  const y = (v) => padT + ((hi - v) / (hi - lo)) * (h - padT - padB);
  const ticks = niceTicks(lo, hi);
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const dots = values
    .map(
      (v, i) =>
        `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4" fill="${color}">
           <title>${years[i]}: ${fmt(v)} ${unit}</title>
         </circle>
         <text x="${x(i).toFixed(1)}" y="${(y(v) - 10).toFixed(1)}" text-anchor="middle"
               font-size="11" fill="#3c4c5e">${fmt(v)}</text>`,
    )
    .join('\n');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(label)} line chart, ${years[0]} to ${years[years.length - 1]}">
  <title>${escape(label)}</title>
  ${ticks.map((t) => `<line x1="${padL}" y1="${y(t).toFixed(1)}" x2="${w - padR}" y2="${y(t).toFixed(1)}" stroke="#e6e0d2" stroke-width="1"/>
  <text x="${padL - 8}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#6b7683">${fmt(t)}</text>`).join('\n')}
  ${years.map((yr, i) => `<text x="${x(i).toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#6b7683">${yr}</text>`).join('\n')}
  <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  ${dots}
</svg>`;
}

// A vertical bar chart. `bars` is [{ label, value, color? }]; negative values
// (e.g. GDP growth) are drawn below the zero line. Bars always start at zero.
export function barChart({ bars, label, unit, height = 260, color = '#2f6fb2' }) {
  const w = 640;
  const h = height;
  const padL = 52;
  const padR = 10;
  const padT = 22;
  const padB = 34;
  const values = bars.map((b) => b.value);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const lo = min - (max - min) * 0.08;
  const hi = max + (max - min) * 0.12;
  const y = (v) => padT + ((hi - v) / (hi - lo)) * (h - padT - padB);
  const slot = (w - padL - padR) / bars.length;
  const barW = Math.min(38, slot * 0.62);
  const ticks = niceTicks(lo, hi);
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(label)} bar chart">
  <title>${escape(label)}</title>
  ${ticks.map((t) => `<line x1="${padL}" y1="${y(t).toFixed(1)}" x2="${w - padR}" y2="${y(t).toFixed(1)}" stroke="#e6e0d2" stroke-width="1"/>
  <text x="${padL - 8}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#6b7683">${fmt(t)}</text>`).join('\n')}
  <line x1="${padL}" y1="${y(0).toFixed(1)}" x2="${w - padR}" y2="${y(0).toFixed(1)}" stroke="#9aa5b1" stroke-width="1.5"/>
  ${bars.map((b, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = Math.min(y(b.value), y(0));
    const bh = Math.abs(y(b.value) - y(0));
    const fill = b.color ?? (b.value < 0 ? '#c2402a' : color);
    return `<rect x="${(cx - barW / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barW}" height="${Math.max(bh, 1).toFixed(1)}" rx="3" fill="${fill}">
      <title>${escape(b.label)}: ${fmt(b.value)} ${unit}</title></rect>
    <text x="${cx.toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle" font-size="11" fill="#3c4c5e">${fmt(b.value)}</text>
    <text x="${cx.toFixed(1)}" y="${h - 12}" text-anchor="middle" font-size="11" fill="#6b7683">${escape(b.label)}</text>`;
  }).join('\n')}
</svg>`;
}

// Horizontal bars for ranked lists (prefectures, cities, trade partners).
export function hbarChart({ rows, label, unit, color = '#12324f', maxRows = 10, height }) {
  const shown = rows.slice(0, maxRows);
  const rowH = 30;
  const h = height ?? (shown.length * rowH + 46);
  const w = 640;
  const padL = 118;
  const padR = 56;
  const max = Math.max(...shown.map((r) => r.value));
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(label)}">
  <title>${escape(label)}</title>
  ${shown.map((r, i) => {
    const y = 14 + i * rowH;
    const bw = ((w - padL - padR) * r.value) / max;
    return `<text x="${padL - 10}" y="${y + 15}" text-anchor="end" font-size="12" fill="#14273d">${escape(r.label)}</text>
    <rect x="${padL}" y="${y}" width="${Math.max(bw, 2).toFixed(1)}" height="18" rx="3" fill="${r.color ?? color}">
      <title>${escape(r.label)}: ${fmt(r.value, 1)} ${unit}</title></rect>
    <text x="${padL + bw + 8}" y="${y + 15}" font-size="12" fill="#3c4c5e">${fmt(r.value, 1)}</text>`;
  }).join('\n')}
</svg>`;
}

// A donut chart for shares that add to 100.
export function donutChart({ parts, label, size = 260 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 34;
  let angle = -Math.PI / 2;
  const slices = parts.map((p) => {
    const a0 = angle;
    const a1 = angle + (p.share / 100) * Math.PI * 2;
    angle = a1;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${p.color}">
      <title>${escape(p.name)}: ${p.share}%</title></path>`;
  });
  return `<svg class="chart" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escape(label)}" style="max-width:${size}px;margin:0 auto">
  <title>${escape(label)}</title>
  ${slices.join('\n')}
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" fill="#6b7683">Share of GDP</text>
  <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="20" font-weight="bold" fill="#0c2237">2023</text>
</svg>`;
}
