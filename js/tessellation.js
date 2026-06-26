(function () {
  const TOTAL_SLOTS = 10; // total capacity the strip implies

  function starPoints(cx, cy, outerR, innerR) {
    let pts = [];
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (Math.PI / 8) * i - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(' ');
  }

  window.renderTessellation = function (filledCount) {
    const strip = document.getElementById('tessellation-strip');
    if (!strip) return;
    strip.innerHTML = '';

    for (let i = 0; i < TOTAL_SLOTS; i++) {
      const filled = i < filledCount;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 34 34');
      svg.setAttribute('class', 'tess-tile');

      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', starPoints(17, 17, 16, 7));
      poly.setAttribute('fill', filled ? 'var(--gold)' : 'none');
      poly.setAttribute('stroke', filled ? 'var(--gold)' : 'var(--gold-soft)');
      poly.setAttribute('stroke-width', '1');
      poly.setAttribute('opacity', filled ? '0.85' : '0.4');

      svg.appendChild(poly);
      strip.appendChild(svg);
    }
  };
})();
