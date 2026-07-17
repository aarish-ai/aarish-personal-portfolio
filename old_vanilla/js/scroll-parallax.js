(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;

  let ticking = false;

  function update() {
    const heroHeight = hero.offsetHeight || window.innerHeight;
    const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
    hero.style.opacity = (1 - progress).toFixed(3);
    hero.style.transform = `translateY(${(progress * 50).toFixed(1)}px) scale(${(1 - progress * 0.05).toFixed(3)})`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
})();
