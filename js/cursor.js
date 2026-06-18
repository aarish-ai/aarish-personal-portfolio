(function () {
  window.initCustomCursor = function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.innerHTML = `
      <span class="cursor-arm cursor-top"></span>
      <span class="cursor-arm cursor-bottom"></span>
      <span class="cursor-arm cursor-left"></span>
      <span class="cursor-arm cursor-right"></span>
    `;
    document.body.appendChild(cursor);
    document.body.classList.add('custom-cursor-active');

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    const CLICKABLE = 'a, button, input, .array-item, .quadrant, ' +
      '.run-btn, .back-btn, #contact-dialog, #expanded-close-btn, ' +
      '#sound-toggle, [onclick], .node, .magnetic';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(CLICKABLE)) {
        cursor.classList.add('cursor-diamond');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(CLICKABLE)) {
        cursor.classList.remove('cursor-diamond');
      }
    });
  };
})();
