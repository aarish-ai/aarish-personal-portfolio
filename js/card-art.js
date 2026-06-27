(function () {
  // Curated palette pairs so generated art never clashes —
  // never fully random colors, just varied combinations of the
  // existing design tokens.
  const PALETTES = [
    { bg: '#ECE2D0', line: 'var(--gold)',     accent: 'var(--teal)' },
    { bg: '#E3DCC8', line: 'var(--teal)',     accent: 'var(--gold)' },
    { bg: '#EAE0C9', line: 'var(--oxblood)',  accent: 'var(--gold)' }
  ];

  function hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function starPoints(cx, cy, outerR, innerR, points, rotationDeg) {
    const pts = [];
    const step = Math.PI / points;
    const rot = (rotationDeg * Math.PI) / 180;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = step * i - Math.PI / 2 + rot;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  // Renders a unique rosette into `containerEl`, seeded by `seed`
  // (the project id) so the same project always gets the same art.
  window.renderCardArt = function (containerEl, seed) {
    const h = hashStr(seed);
    const palette = PALETTES[h % PALETTES.length];
    const rotation = h % 23;

    containerEl.innerHTML = `
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
           style="width:100%;height:100%;display:block;" aria-hidden="true">
        <rect width="200" height="200" fill="${palette.bg}"/>
        <polygon points="${starPoints(100, 100, 92, 40, 8, rotation)}"
                 fill="none" stroke="${palette.line}" stroke-width="1" opacity="0.35"/>
        <polygon points="${starPoints(100, 100, 64, 28, 8, rotation + 22.5)}"
                 fill="none" stroke="${palette.accent}" stroke-width="1" opacity="0.5"/>
        <polygon points="${starPoints(100, 100, 30, 12, 8, rotation)}"
                 fill="${palette.line}" opacity="0.18"/>
      </svg>
    `;
  };

  // Tries the real project image first; falls back to generated
  // art if it 404s or the path is empty. This is progressive
  // enhancement — add real screenshots later and they'll just work.
  window.mountCardArt = function (containerEl, project) {
    if (!project.image) {
      renderCardArt(containerEl, project.id);
      return;
    }
    const probe = new Image();
    probe.onload = () => {
      containerEl.innerHTML = `<img src="${project.image}" alt="${project.name}"
        style="width:100%;height:100%;object-fit:cover;display:block;">`;
    };
    probe.onerror = () => {
      renderCardArt(containerEl, project.id);
    };
    probe.src = project.image;
  };
})();
