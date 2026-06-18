(function () {
  const RADIUS = 55;       // px — activation distance
  const STRENGTH = 0.35;   // pull intensity, 0–1
  const MAX_OFFSET = 12;   // px — cap on movement

  window.initMagnetic = function (selector) {
    const els = document.querySelectorAll(selector || '.magnetic');
    if (!els.length) return;

    els.forEach(el => {
      el.style.transition = 'transform 200ms ease-out';
      el.style.willChange = 'transform';
    });

    window.addEventListener('mousemove', (e) => {
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          const pull = (1 - dist / RADIUS) * STRENGTH;
          const offsetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx * pull));
          const offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dy * pull));
          el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        } else {
          el.style.transform = 'translate(0, 0)';
        }
      });
    });
  };
})();
