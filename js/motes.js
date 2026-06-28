(function () {
  const field = document.querySelector('.motes-field');
  if (!field) return;

  const COUNT = 16;
  for (let i = 0; i < COUNT; i++) {
    const mote = document.createElement('div');
    mote.className = 'mote';

    const left = Math.random() * 100;
    const top = 40 + Math.random() * 55; // lower half of hero, away from the text block
    const duration = 14 + Math.random() * 10;
    const delay = Math.random() * 14;
    const driftX = (Math.random() * 40 - 20).toFixed(1) + 'px';

    mote.style.left = `${left}%`;
    mote.style.top = `${top}%`;
    mote.style.setProperty('--mote-drift-x', driftX);
    mote.style.animationDuration = `${duration}s`;
    mote.style.animationDelay = `${delay}s`;

    field.appendChild(mote);
  }
})();
