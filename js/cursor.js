(function () {
  window.initCustomCursor = function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (document.getElementById('custom-cursor')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'custom-cursor';
    wrapper.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24">
        <g class="cursor-plus-group">
          <rect x="10.5" y="3"  width="3"  height="18" fill="#ffffff"/>
          <rect x="3"    y="10.5" width="18" height="3" fill="#ffffff"/>
        </g>
        <g class="cursor-diamond-group">
          <path d="M12,3 L21,12 L12,21 L3,12 Z"
                fill="none" stroke="#ffffff" stroke-width="2"/>
        </g>
      </svg>
    `;
    document.body.appendChild(wrapper);
    document.body.classList.add('custom-cursor-active');

    window.addEventListener('mousemove', (e) => {
      wrapper.style.left = e.clientX + 'px';
      wrapper.style.top  = e.clientY + 'px';
    });

    const CLICKABLE = 'a, button, input, .array-item, .quadrant, ' +
      '.run-btn, .back-btn, #contact-dialog, #expanded-close-btn, ' +
      '#sound-toggle, [onclick], .node, .magnetic';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(CLICKABLE)) {
        wrapper.classList.add('cursor-diamond');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(CLICKABLE)) {
        wrapper.classList.remove('cursor-diamond');
      }
    });
  };
})();
