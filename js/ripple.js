window.initRipple = function(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  const ripples = [];
  const colors = [
    '45, 212, 191', // teal
    '56, 189, 248'  // keyword blue
  ];
  let colorIndex = 0;

  function spawnRipple() {
    ripples.push({
      x: Math.random() * W,
      y: Math.random() * H,
      radius: 0,
      maxRadius: 180 + Math.random() * 200, // 180 to 380
      opacity: 0.07,
      color: colors[colorIndex % colors.length],
      speed: 0.6
    });
    colorIndex++;
  }

  setInterval(spawnRipple, 3500);
  spawnRipple(); // spawn first one immediately

  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      
      // Update
      r.radius += r.speed;
      const progress = r.radius / r.maxRadius;
      r.opacity = 0.07 * (1 - progress);

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }

      // Draw main ring
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color}, ${r.opacity})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Draw inner ring 80%
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color}, ${r.opacity * 0.4})`;
      ctx.stroke();

      // Draw inner ring 60%
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color}, ${r.opacity * 0.4})`;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  animate();
};
