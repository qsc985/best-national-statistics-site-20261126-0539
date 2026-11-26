// Japan Stat Atlas — small SVG chart builders.
//
// No library: every chart is plain SVG drawn by these functions, so the site
// has no dependency to fetch and the first load stays small. Each builder
// takes plain arrays of {label, value} points and returns an SVG string.

window.ATLAS_CHARTS = (function () {
  var NAVY = '#1d2f4e';
  var VERMILION = '#c0392b';
  var GOLD = '#c9a227';
  var TEAL = '#2e7d6b';
  var GRID = '#d8d2c2';
  var INK = '#22201a';

  function esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function niceMax(values) {
    var m = Math.max.apply(null, values.map(Math.abs));
    if (m <= 0) return 1;
    var step = Math.pow(10, Math.floor(Math.log10(m)));
    return Math.ceil(m / step) * step;
  }

  function frame(width, height, title) {
    return '<svg class="chart" viewBox="0 0 ' + width + ' ' + height +
      '" role="img" aria-label="' + esc(title) + '" preserveAspectRatio="xMidYMid meet">';
  }

  // A line chart with labelled axes and a dot on every point.
  function lineChart(points, opts) {
    var w = 640, h = 300, padL = 52, padR = 16, padT = 18, padB = 34;
    var vals = points.map(function (p) { return p.value; });
    var max = niceMax(vals);
    var min = Math.min(0, Math.min.apply(null, vals));
    var span = max - min || 1;
    var x = function (i) { return padL + (i * (w - padL - padR)) / Math.max(1, points.length - 1); };
    var y = function (v) { return padT + ((max - v) / span) * (h - padT - padB); };
    var out = frame(w, h, opts.title);
    out += '<line x1="' + padL + '" y1="' + y(0) + '" x2="' + (w - padR) + '" y2="' + y(0) +
      '" stroke="' + INK + '" stroke-width="1"/>';
    [0, max / 2, max].forEach(function (g) {
      out += '<line x1="' + padL + '" y1="' + y(g) + '" x2="' + (w - padR) + '" y2="' + y(g) +
        '" stroke="' + GRID + '" stroke-width="1"/>' +
        '<text x="' + (padL - 8) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-size="11" fill="' + INK + '">' +
        esc(opts.format(g)) + '</text>';
    });
    var path = points.map(function (p, i) { return (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ' ' + y(p.value).toFixed(1); }).join(' ');
    out += '<path d="' + path + '" fill="none" stroke="' + NAVY + '" stroke-width="2.5"/>';
    points.forEach(function (p, i) {
      out += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.value).toFixed(1) + '" r="4" fill="' + VERMILION + '">' +
        '<title>' + esc(p.label + ': ' + opts.format(p.value)) + '</title></circle>' +
        '<text x="' + x(i) + '" y="' + (y(p.value) - 10) + '" text-anchor="middle" font-size="11" font-weight="600" fill="' + INK + '">' +
        esc(opts.format(p.value)) + '</text>' +
        '<text x="' + x(i) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="' + INK + '">' + esc(p.label) + '</text>';
    });
    return out + '</svg>';
  }

  // A vertical bar chart; negative bars hang below the zero line in vermilion.
  function barChart(points, opts) {
    var w = 640, h = 300, padL = 52, padR = 16, padT = 18, padB = 34;
    var vals = points.map(function (p) { return p.value; });
    var max = niceMax(vals);
    var min = Math.min(0, Math.min.apply(null, vals));
    var span = max - min || 1;
    var slot = (w - padL - padR) / points.length;
    var y = function (v) { return padT + ((max - v) / span) * (h - padT - padB); };
    var out = frame(w, h, opts.title);
    [min, 0, max].forEach(function (g) {
      out += '<line x1="' + padL + '" y1="' + y(g) + '" x2="' + (w - padR) + '" y2="' + y(g) +
        '" stroke="' + (g === 0 ? INK : GRID) + '" stroke-width="1"/>' +
        '<text x="' + (padL - 8) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-size="11" fill="' + INK + '">' +
        esc(opts.format(g)) + '</text>';
    });
    points.forEach(function (p, i) {
      var bx = padL + i * slot + slot * 0.18;
      var bw = slot * 0.64;
      var top = y(Math.max(p.value, 0));
      var bottom = y(Math.min(p.value, 0));
      out += '<rect x="' + bx.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) +
        '" height="' + Math.max(1, bottom - top).toFixed(1) + '" fill="' + (p.value < 0 ? VERMILION : NAVY) + '">' +
        '<title>' + esc(p.label + ': ' + opts.format(p.value)) + '</title></rect>' +
        '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (p.value < 0 ? bottom + 16 : top - 6).toFixed(1) +
        '" text-anchor="middle" font-size="11" font-weight="600" fill="' + INK + '">' + esc(opts.format(p.value)) + '</text>' +
        '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="' + INK + '">' +
        esc(p.label) + '</text>';
    });
    return out + '</svg>';
  }

  // Horizontal bars for ranked categories (regions, cities).
  function hbarChart(rows, opts) {
    var w = 640, rowH = 34, h = 24 + rows.length * rowH + 8;
    var max = niceMax(rows.map(function (r) { return r.value; }));
    var out = frame(w, h, opts.title);
    rows.forEach(function (r, i) {
      var y = 24 + i * rowH;
      var bw = (r.value / max) * (w - 220);
      out += '<text x="0" y="' + (y + 15) + '" font-size="12" fill="' + INK + '">' + esc(r.label) + '</text>' +
        '<rect x="150" y="' + y + '" width="' + Math.max(2, bw).toFixed(1) + '" height="20" fill="' + (i % 2 ? TEAL : NAVY) + '">' +
        '<title>' + esc(r.label + ': ' + opts.format(r.value)) + '</title></rect>' +
        '<text x="' + (154 + Math.max(2, bw)).toFixed(1) + '" y="' + (y + 15) + '" font-size="12" font-weight="600" fill="' + INK + '">' +
        esc(opts.format(r.value)) + '</text>';
    });
    return out + '</svg>';
  }

  // A donut chart with a legend; the centre carries the total.
  function donutChart(slices, opts) {
    var size = 300, cx = 150, cy = 150, r = 110, inner = 68;
    var total = slices.reduce(function (s, d) { return s + d.value; }, 0);
    var colors = [NAVY, VERMILION, GOLD, TEAL];
    var out = frame(size, size, opts.title);
    var angle = -Math.PI / 2;
    slices.forEach(function (s, i) {
      var frac = s.value / total;
      var a0 = angle, a1 = angle + frac * Math.PI * 2;
      angle = a1;
      var large = frac > 0.5 ? 1 : 0;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      var xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
      var xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
      out += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large +
        ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L ' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) +
        ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) +
        ' Z" fill="' + colors[i % colors.length] + '"><title>' + esc(s.label + ': ' + s.value + '%') + '</title></path>';
    });
    out += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="22" font-weight="700" fill="' + INK + '">' +
      esc(opts.centre) + '</text>' +
      '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11" fill="' + INK + '">' + esc(opts.centreLabel) + '</text>';
    return out + '</svg>';
  }

  return { lineChart: lineChart, barChart: barChart, hbarChart: hbarChart, donutChart: donutChart };
})();
