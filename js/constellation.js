(function () {
  // EDIT THESE — top/left are plain numbers (percent of the hero
  // area, no "%" sign). 8–10 entries works well. label is shown
  // bold in the tooltip, detail is the line under it. Keep these
  // out of roughly left 0–45% / top 20–65% (the text column) so
  // nothing crowds the name and intro.
  const MARKERS = [
    { top: 10, left: 55, label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: 18, left: 85, label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: 35, left: 70, label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: 46, left: 92, label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: 55, left: 60, label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: 64, left: 88, label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: 80, left: 25, label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: 88, left: 65, label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: 93, left: 45, label: 'EDIT ME', detail: 'Edit this detail text' }
  ];

  const field = document.getElementById('constellation');
  if (!field) return;

  const NS = 'http://www.w3.org/2000/svg';

  // Connects each point to its 2 nearest neighbors — a natural
  // constellation web that recomputes automatically if you edit,
  // add, or remove markers above.
  function buildEdges(points) {
    const edgeSet = new Set();
    points.forEach((p, i) => {
      const distances = points
        .map((q, j) => ({ j, d: Math.hypot(p.top - q.top, p.left - q.left) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      distances.forEach((o) => {
        const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
        edgeSet.add(key);
      });
    });
    return Array.from(edgeSet).map((key) => key.split('-').map(Number));
  }

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('class', 'constellation-lines');

  const edges = buildEdges(MARKERS);
  const lineEls = edges.map(([i, j]) => {
    const a = MARKERS[i], b = MARKERS[j];
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', a.left);
    line.setAttribute('y1', a.top);
    line.setAttribute('x2', b.left);
    line.setAttribute('y2', b.top);
    line.setAttribute('class', 'const-line');
    svg.appendChild(line);
    return { el: line, i, j };
  });

  field.appendChild(svg);

  MARKERS.forEach((m, idx) => {
    const dot = document.createElement('button');
    dot.className = 'constellation-dot';
    dot.style.top = `${m.top}%`;
    dot.style.left = `${m.left}%`;
    dot.setAttribute('aria-label', m.label);

    const tip = document.createElement('div');
    tip.className = 'constellation-tip';
    tip.innerHTML = `<strong>${m.label}</strong><span>${m.detail}</span>`;
    dot.appendChild(tip);
    field.appendChild(dot);

    let tipTimer = null;

    function activate() {
      lineEls.forEach(({ el, i, j }) => {
        if (i === idx || j === idx) el.classList.add('active');
      });
      clearTimeout(tipTimer);
      tipTimer = setTimeout(() => tip.classList.add('visible'), 160);
    }

    function deactivate() {
      clearTimeout(tipTimer);
      tip.classList.remove('visible');
      lineEls.forEach(({ el, i, j }) => {
        if (i === idx || j === idx) el.classList.remove('active');
      });
    }

    dot.addEventListener('mouseenter', activate);
    dot.addEventListener('mouseleave', deactivate);
    dot.addEventListener('focus', activate);
    dot.addEventListener('blur', deactivate);
  });
})();
