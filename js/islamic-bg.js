(function () {
  window.initIslamicBg = function (canvasId) {
    console.log('[islamic-bg] init called for canvas id:', canvasId);

    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('[islamic-bg] FATAL: canvas element not found:', canvasId);
      return;
    }
    console.log('[islamic-bg] canvas element found:', canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('[islamic-bg] FATAL: could not get 2d context');
      return;
    }

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('[islamic-bg] resized to', canvas.width, 'x', canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    let angle = 0;
    const ROTATE_SPEED = 0.0006;

    const COLOR_TEAL = '#2dd4bf';
    const COLOR_BLUE = '#38bdf8';

    function drawStar(cx, cy, outerR, innerR, points, rotation, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (Math.PI / points) * i + rotation;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    function drawCrossingOctagram(cx, cy, radius, rotation, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const pts = [];
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 4) * i + rotation;
        pts.push([cx + radius * Math.cos(a), cy + radius * Math.sin(a)]);
      }
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 3) % 8];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.75;
      ctx.stroke();
      ctx.restore();
    }

    let frameCount = 0;
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseR = Math.min(canvas.width, canvas.height) * 0.32;

      drawStar(cx, cy, baseR, baseR * 0.55, 8, angle, COLOR_TEAL, 0.10);
      drawStar(cx, cy, baseR * 0.7, baseR * 0.4, 8, -angle * 1.4, COLOR_BLUE, 0.09);
      drawCrossingOctagram(cx, cy, baseR * 0.85, angle * 0.6, COLOR_TEAL, 0.10);

      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.strokeStyle = COLOR_BLUE;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.10;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.15, 0, Math.PI * 2);
      ctx.strokeStyle = COLOR_TEAL;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();

      angle += ROTATE_SPEED;
      frameCount++;
      if (frameCount === 1) {
        console.log('[islamic-bg] first frame drawn successfully');
      }
      requestAnimationFrame(frame);
    }
    frame();
  };
})();
