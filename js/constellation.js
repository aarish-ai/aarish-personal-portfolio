(function () {
  const NS = 'http://www.w3.org/2000/svg';

  // 7 hand-placed layouts. Every point sits in the top (<=15) or
  // bottom (>=84) band only — see note above for why. Feel free to
  // add/remove layouts or nudge individual points, just keep new
  // points within those same top/bottom bands.
  const CONSTELLATIONS = [
    // 1 — The Arc
    [
      { top: 8, left: 10 }, { top: 7, left: 25 }, { top: 9, left: 40 },
      { top: 10, left: 55 }, { top: 9, left: 70 }, { top: 8, left: 85 },
      { top: 88, left: 20 }, { top: 90, left: 50 }, { top: 88, left: 80 }
    ],
    // 2 — The Crown
    [
      { top: 14, left: 8 }, { top: 7, left: 18 }, { top: 13, left: 30 },
      { top: 6, left: 42 }, { top: 13, left: 54 }, { top: 7, left: 66 },
      { top: 13, left: 80 }, { top: 7, left: 92 }, { top: 90, left: 50 }
    ],
    // 3 — The Scales
    [
      { top: 9, left: 15 }, { top: 8, left: 50 }, { top: 9, left: 85 },
      { top: 85, left: 10 }, { top: 91, left: 20 }, { top: 88, left: 30 },
      { top: 85, left: 70 }, { top: 91, left: 80 }, { top: 88, left: 90 }
    ],
    // 4 — The Lantern Chain
    [
      { top: 7, left: 12 }, { top: 11, left: 28 }, { top: 8, left: 45 },
      { top: 12, left: 62 }, { top: 7, left: 78 }, { top: 11, left: 93 },
      { top: 89, left: 35 }, { top: 87, left: 50 }, { top: 85, left: 65 }
    ],
    // 5 — The Twin Arcs
    [
      { top: 6, left: 20 }, { top: 10, left: 35 }, { top: 6, left: 50 },
      { top: 10, left: 65 }, { top: 6, left: 80 }, { top: 92, left: 25 },
      { top: 86, left: 45 }, { top: 92, left: 65 }, { top: 86, left: 85 }
    ],
    // 6 — The Wide Net
    [
      { top: 8, left: 6 }, { top: 13, left: 22 }, { top: 7, left: 38 },
      { top: 13, left: 58 }, { top: 7, left: 74 }, { top: 13, left: 90 },
      { top: 88, left: 15 }, { top: 84, left: 50 }, { top: 88, left: 85 }
    ],
    // 7 — The Diamond Span
    [
      { top: 9, left: 10 }, { top: 6, left: 30 }, { top: 10, left: 50 },
      { top: 6, left: 70 }, { top: 9, left: 90 }, { top: 90, left: 20 },
      { top: 86, left: 50 }, { top: 90, left: 80 }, { top: 88, left: 65 }
    ]
  ];

  // EDIT THESE — one entry per dot index (0–8), reused across
  // whichever of the 7 layouts above loads. label is bold in the
  // tooltip, detail is the line underneath.
  const LABELS = [
    { label: 'EDIT ME 1', detail: 'Edit this detail text' },
    { label: 'EDIT ME 2', detail: 'Edit this detail text' },
    { label: 'EDIT ME 3', detail: 'Edit this detail text' },
    { label: 'EDIT ME 4', detail: 'Edit this detail text' },
    { label: 'EDIT ME 5', detail: 'Edit this detail text' },
    { label: 'EDIT ME 6', detail: 'Edit this detail text' },
    { label: 'EDIT ME 7', detail: 'Edit this detail text' },
    { label: 'EDIT ME 8', detail: 'Edit this detail text' },
    { label: 'EDIT ME 9', detail: 'Edit this detail text' }
  ];

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

  const field = document.getElementById('constellation');
  if (!field) return;

  const points = CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];
  const MARKERS = points.map((p, i) => ({
    top: p.top, left: p.left,
    label: LABELS[i % LABELS.length].label,
    detail: LABELS[i % LABELS.length].detail
  }));

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
