(function () {
  const TOTAL_SLOTS = 10;

  function starPoints(cx, cy, outerR, innerR) {
    let pts = [];
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (Math.PI / 8) * i - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(' ');
  }

  function buildTile() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 34 34');
    svg.setAttribute('class', 'tess-tile');

    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', starPoints(17, 17, 16, 7));
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', 'var(--gold-soft)');
    poly.setAttribute('stroke-width', '1');
    poly.setAttribute('opacity', '0.4');
    poly.style.transition = 'fill 300ms ease, stroke 300ms ease, opacity 300ms ease, transform 300ms ease';

    svg.appendChild(poly);
    return svg;
  }

  let tiles = [];

  // Renders all tiles as empty outlines and remembers how many
  // should eventually fill — actual filling is deferred to
  // fillTessellationSequentially(), called by js/scroll-reveal.js
  window.renderTessellation = function (filledCount) {
    const strip = document.getElementById('tessellation-strip');
    if (!strip) return;
    strip.innerHTML = '';
    tiles = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      const tile = buildTile();
      strip.appendChild(tile);
      tiles.push(tile);
    }
    strip.dataset.pendingFill = filledCount;
  };

  window.fillTessellationSequentially = function () {
    const strip = document.getElementById('tessellation-strip');
    if (!strip || tiles.length === 0) {
      // projects.json probably still loading — retry shortly
      setTimeout(() => window.fillTessellationSequentially(), 200);
      return;
    }
    const count = parseInt(strip.dataset.pendingFill || '0', 10);
    tiles.slice(0, count).forEach((tile, i) => {
      setTimeout(() => {
        const poly = tile.querySelector('polygon');
        poly.setAttribute('fill', 'var(--gold)');
        poly.setAttribute('stroke', 'var(--gold)');
        poly.setAttribute('opacity', '0.85');
        tile.style.transform = 'scale(1.15)';
        setTimeout(() => { tile.style.transform = 'scale(1)'; }, 180);
      }, i * 110);
    });
  };
})();
