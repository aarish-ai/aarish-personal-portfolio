(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'motes-canvas';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d', { alpha: true });
  
  let width, height;
  let particles = [];
  const NUM_PARTICLES = 90;
  
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });
  resize();
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(createParticle(true));
    }
  }
  
  function createParticle(initial = false) {
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + Math.random() * 30,
      size: 0.6 + Math.random() * 1.2,
      speedY: -0.12 - Math.random() * 0.23,
      speedX: -0.04 + Math.random() * 0.08,
      opacity: Math.random() * 0.55,
      life: initial ? Math.random() : 0,
      lifeSpeed: 0.0008 + Math.random() * 0.0012,
      wander: 0,
      lampGlow: 0
    };
  }
  
  initParticles();
  
  let cursorX = width / 2;
  let cursorY = height / 2;
  let cursorVX = 0;
  let cursorVY = 0;
  let prevX = cursorX;
  let prevY = cursorY;
  
  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorVX = (cursorX - prevX) * 0.3 + cursorVX * 0.7;
    cursorVY = (cursorY - prevY) * 0.3 + cursorVY * 0.7;
    prevX = cursorX;
    prevY = cursorY;
  });
  
  let animationFrame;
  let lastTime = 0;
  
  function tick(time) {
    if (!lastTime) lastTime = time;
    lastTime = time;
    
    // Check if hero is in viewport
    const hero = document.getElementById('hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0) {
        animationFrame = requestAnimationFrame(tick);
        return; // Paused
      }
    }
    
    ctx.clearRect(0, 0, width, height);
    
    const sweepRadius = 90;
    const lampRadius = 160;
    const lX = window.lampWorldX || -9999;
    const lY = window.lampWorldY || -9999;
    
    for (let i = 0; i < NUM_PARTICLES; i++) {
      let p = particles[i];
      
      if (p.life >= 1) {
        particles[i] = createParticle();
        p = particles[i];
      }
      
      p.x += p.speedX + p.wander * 0.3;
      p.y += p.speedY;
      p.life += p.lifeSpeed;
      p.wander = Math.sin(time * 0.0008 + p.x * 0.01) * 0.5;
      
      const dx = p.x - cursorX;
      const dy = p.y - cursorY;
      const dist = Math.hypot(dx, dy);
      
      if (dist < sweepRadius) {
        const influence = (1 - dist / sweepRadius) * 0.4;
        p.x += cursorVX * influence * 0.08;
        p.y += cursorVY * influence * 0.06;
      }
      
      const ldx = p.x - lX;
      const ldy = p.y - lY;
      const lampDist = Math.hypot(ldx, ldy);
      p.lampGlow = Math.max(0, 1 - lampDist / lampRadius);
      
      let lifeAlpha = 1;
      if (p.life < 0.15) lifeAlpha = p.life / 0.15;
      if (p.life > 0.80) lifeAlpha = (1 - p.life) / 0.20;
      
      const baseOpacity = p.opacity * lifeAlpha;
      const glowBoost = p.lampGlow * 0.5;
      const finalOpacity = Math.min(0.85, baseOpacity + glowBoost);
      
      if (finalOpacity <= 0.01) continue;
      
      const r = Math.round(212 + p.lampGlow * 42);
      const g = Math.round(195 + p.lampGlow * 23);
      const b = Math.round(150 - p.lampGlow * 40);
      
      ctx.save();
      if (p.lampGlow > 0.1) {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        gradient.addColorStop(0, `rgba(${r},${g},${b},${finalOpacity * 0.6})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = `rgba(${r},${g},${b},${finalOpacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Decay cursor velocity
    cursorVX *= 0.95;
    cursorVY *= 0.95;
    
    animationFrame = requestAnimationFrame(tick);
  }
  
  animationFrame = requestAnimationFrame(tick);
  
})();
