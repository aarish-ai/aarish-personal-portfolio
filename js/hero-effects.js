(function () {
  const hero   = document.getElementById('hero');
  const lamp   = document.querySelector('.lamplight');
  const cursor = document.getElementById('hero-cursor');
  if (!hero) return;

  let targetX = 0, targetY = 0, lampX = 0, lampY = 0, ticking = false;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;

    if (cursor) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top  = `${e.clientY}px`;
    }

    if (lamp && !ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
  });

  function tick() {
    lampX += (targetX - lampX) * 0.12;
    lampY += (targetY - lampY) * 0.12;
    lamp.style.transform = `translate(${lampX - 240}px, ${lampY - 240}px)`;
    if (Math.abs(targetX - lampX) > 0.5 || Math.abs(targetY - lampY) > 0.5) {
      requestAnimationFrame(tick);
    } else {
      ticking = false;
    }
  }

  hero.addEventListener('mouseenter', () => {
    hero.classList.add('lamplight-active');
    if (cursor) cursor.classList.add('active');
  });
  hero.addEventListener('mouseleave', () => {
    hero.classList.remove('lamplight-active');
    if (cursor) cursor.classList.remove('active');
  });
})();
