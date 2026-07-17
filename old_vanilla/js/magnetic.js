(function () {
  function magnetize(el, strength, extraTransform) {
    if (!el) return;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px) ${extraTransform || ''}`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 300ms ease';
      el.style.transform = 'translate(0,0)';
      setTimeout(() => { el.style.transition = ''; }, 300);
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    magnetize(document.getElementById('contact-seal'), 0.25, 'scale(1.06)');
    magnetize(document.getElementById('scroll-cue'), 0.3, '');
  });
})();
