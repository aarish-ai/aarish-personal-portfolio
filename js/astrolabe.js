(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const CX = 200, CY = 200;

  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function polarPoint(cx, cy, r, angleDeg) {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  // Same 8-point star math used in tessellation.js / card-art.js —
  // kept consistent across the whole site's geometry.
  function starPoints(cx, cy, outerR, innerR) {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (Math.PI / 8) * i - Math.PI / 2;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(' ');
  }

  function buildAstrolabe() {
    const svg = el('svg', { viewBox: '0 0 400 400', class: 'astrolabe-svg', 'aria-hidden': 'true' });

    // Outer group: fixed bezel + 72 degree ticks (every 5°, longer
    // ticks every 30°) — the instrument's fixed measurement scale
    const outer = el('g', { class: 'astro-ring astro-outer' });
    outer.appendChild(el('circle', { cx: CX, cy: CY, r: 188, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 1.4 }));
    outer.appendChild(el('circle', { cx: CX, cy: CY, r: 172, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 0.6, opacity: 0.5 }));
    for (let i = 0; i < 72; i++) {
      const deg = i * 5;
      const isMajor = deg % 30 === 0;
      const innerR = isMajor ? 164 : (deg % 15 === 0 ? 172 : 180);
      const [x1, y1] = polarPoint(CX, CY, 188, deg);
      const [x2, y2] = polarPoint(CX, CY, innerR, deg);
      outer.appendChild(el('line', {
        x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2),
        stroke: 'var(--gold)', 'stroke-width': isMajor ? 1.2 : 0.6, opacity: isMajor ? 0.7 : 0.4
      }));
    }
    svg.appendChild(outer);

    // Middle group: rotating ring with 8 diamond ecliptic markers
    const middle = el('g', { class: 'astro-ring astro-middle' });
    middle.appendChild(el('circle', { cx: CX, cy: CY, r: 132, fill: 'none', stroke: 'var(--teal)', 'stroke-width': 1, opacity: 0.45 }));
    for (let i = 0; i < 8; i++) {
      const [x, y] = polarPoint(CX, CY, 132, i * 45);
      middle.appendChild(el('rect', {
        x: (x - 4).toFixed(2), y: (y - 4).toFixed(2), width: 8, height: 8,
        transform: `rotate(45 ${x.toFixed(2)} ${y.toFixed(2)})`,
        fill: 'var(--gold)', opacity: 0.55
      }));
    }
    svg.appendChild(middle);

    // Inner group: fixed plain reference ring
    const inner = el('g', { class: 'astro-ring astro-inner' });
    inner.appendChild(el('circle', { cx: CX, cy: CY, r: 86, fill: 'none', stroke: 'var(--gold-soft)', 'stroke-width': 1 }));
    svg.appendChild(inner);

    // Pointer group: rotating two-ended sighting rule (alidade)
    const pointer = el('g', { class: 'astro-ring astro-pointer' });
    const [px1, py1] = polarPoint(CX, CY, 176, 35);
    const [px2, py2] = polarPoint(CX, CY, 176, 215);
    pointer.appendChild(el('line', { x1: px1.toFixed(2), y1: py1.toFixed(2), x2: px2.toFixed(2), y2: py2.toFixed(2), stroke: 'var(--gold)', 'stroke-width': 1.4 }));
    [35, 215].forEach((deg) => {
      const [tx, ty] = polarPoint(CX, CY, 176, deg);
      pointer.appendChild(el('rect', {
        x: (tx - 5).toFixed(2), y: (ty - 5).toFixed(2), width: 10, height: 10,
        transform: `rotate(45 ${tx.toFixed(2)} ${ty.toFixed(2)})`,
        fill: 'none', stroke: 'var(--gold)', 'stroke-width': 1
      }));
    });
    svg.appendChild(pointer);

    // Center boss: a finished, filled 8-point star — this is the
    // resolved version of what the old rosette only sketched out
    svg.appendChild(el('polygon', { points: starPoints(CX, CY, 22, 10), fill: 'var(--gold)', opacity: 0.5 }));

    return svg;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-illumination');
    if (!container) return;
    container.innerHTML = '';
    container.appendChild(buildAstrolabe());
  });
})();
