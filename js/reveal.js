(function () {
  document.addEventListener('DOMContentLoaded', () => {
    
    // We expect the rosette elements to be drawn by astrolabe.js synchronously or slightly after.
    // Wait for the SVG to be populated, or just run the sequence.
    // astrolabe.js will inject paths. We'll wait a frame to ensure DOM is ready.
    
    setTimeout(() => {
      const heroText = document.getElementById('hero-text');
      const bottomRow = document.querySelector('.hero-bottom-row');
      
      // Phase 1: Rosette draw-in handled largely by astrolabe.js which sets up the stroke-dasharrays.
      // But we will coordinate the text fading here.
      
      // Phase 2: Hero text fades in (2200ms -> 3200ms)
      if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(12px)';
        heroText.style.transition = 'opacity 800ms ease-out, transform 800ms ease-out';
        
        setTimeout(() => {
          heroText.style.opacity = '1';
          heroText.style.transform = 'translateY(0)';
        }, 2200);
      }
      
      // Phase 3: Bottom row appears (3000ms -> 3400ms)
      if (bottomRow) {
        bottomRow.style.opacity = '0';
        bottomRow.style.transition = 'opacity 400ms ease';
        
        setTimeout(() => {
          bottomRow.style.opacity = '1';
        }, 3000);
      }
      
    }, 50); // slight delay to let rosette geometry build
    
  });
})();
