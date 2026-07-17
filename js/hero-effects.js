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

    window.lampWorldX = lampX;
    window.lampWorldY = lampY;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.5;
    const dist = Math.hypot(lampX - cx, lampY - cy);
    const proximity = Math.max(0, 1 - dist / maxDist);

    const rosetteOpacity = 0.42 + (proximity * 0.38);
    const rosetteSvg = document.getElementById('rosette-svg');
    if (rosetteSvg && !window.rosetteUnfolded) {
      rosetteSvg.style.opacity = rosetteOpacity;
    }

    const warmth = (proximity * 0.15).toFixed(3);
    document.documentElement.style.setProperty('--lamp-warm', warmth);


    hero.dispatchEvent(new CustomEvent('lamplight:move', { detail: { x: lampX, y: lampY } }));

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
