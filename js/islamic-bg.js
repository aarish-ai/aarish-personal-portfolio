(function () {
  window.initIslamicBg = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let angle = 0;
    const ROTATE_SPEED = 0.0006; // radians per frame — very slow
    const COLOR_TEAL = 'rgba(45, 212, 191, 0.07)';
    const COLOR_BLUE = 'rgba(56, 189, 248, 0.06)';

    function drawStar(cx, cy, outerR, innerR, points, rotation, color) {
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
    }

    function drawCrossingOctagram(cx, cy, radius, rotation, color) {
      // 8 points around the circle, connect every point to the one
      // 3 steps away — produces the classic 8-pointed star weave
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
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseR = Math.min(canvas.width, canvas.height) * 0.32;

      drawStar(cx, cy, baseR, baseR * 0.55, 8, angle, COLOR_TEAL);
      drawStar(cx, cy, baseR * 0.7, baseR * 0.4, 8, -angle * 1.4, COLOR_BLUE);
      drawCrossingOctagram(cx, cy, baseR * 0.85, angle * 0.6, COLOR_TEAL);

      // Two faint framing circles
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.strokeStyle = COLOR_BLUE;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.15, 0, Math.PI * 2);
      ctx.strokeStyle = COLOR_TEAL;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      angle += ROTATE_SPEED;
      requestAnimationFrame(frame);
    }
    frame();
  };
})();
