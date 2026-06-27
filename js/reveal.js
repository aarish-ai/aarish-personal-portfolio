(function () {
  window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('reveal-overlay');
    const star    = document.getElementById('reveal-star');

    // Star draws itself like ink tracing a line
    requestAnimationFrame(() => {
      star.classList.add('draw');
    });

    // Once drawn, the overlay irises shut around the star and
    // disappears, revealing the page that's already rendered beneath
    setTimeout(() => {
      overlay.classList.add('iris-close');
      star.classList.add('fade');
    }, 400);

    // Remove from DOM flow entirely once the animation completes
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 850);
  });
})();
