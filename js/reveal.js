(function () {
  window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('reveal-overlay');
    const star    = document.getElementById('reveal-star');

    // Trigger star grow almost immediately
    requestAnimationFrame(() => {
      star.style.opacity = '1';
      setTimeout(() => {
        star.classList.add('grow');
      }, 50);
    });

    // Begin fading the whole overlay shortly after the star starts
    // growing, so it feels like one continuous flourish, not two
    // separate steps
    setTimeout(() => {
      overlay.classList.add('fade-out');
    }, 380);

    // Remove overlay from the DOM flow entirely once faded
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 750);
  });
})();
