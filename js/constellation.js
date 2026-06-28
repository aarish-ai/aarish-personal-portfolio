(function () {
  // EDIT THESE — top/left are percentages of the hero area. Keep
  // markers out of roughly the left 0–45% (the text column) and
  // give the astrolabe (roughly right 55–95%, vertically centered)
  // some breathing room too. label = short title shown bold,
  // detail = the line underneath it.
  const MARKERS = [
    { top: '78%', left: '30%', label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: '15%', left: '60%', label: 'EDIT ME', detail: 'Edit this detail text' },
    { top: '85%', left: '68%', label: 'EDIT ME', detail: 'Edit this detail text' }
  ];

  const field = document.getElementById('constellation');
  if (!field) return;

  MARKERS.forEach((m) => {
    const dot = document.createElement('button');
    dot.className = 'constellation-dot';
    dot.style.top = m.top;
    dot.style.left = m.left;
    dot.setAttribute('aria-label', m.label);

    const tip = document.createElement('div');
    tip.className = 'constellation-tip';
    tip.innerHTML = `<strong>${m.label}</strong><span>${m.detail}</span>`;

    dot.appendChild(tip);
    field.appendChild(dot);
  });
})();
