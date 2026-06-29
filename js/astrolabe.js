(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const CX = 200, CY = 200;

  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function polarPoint(cx, cy, r, angleDeg) {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }

  function starPoints(cx, cy, outerR, innerR) {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (Math.PI / 8) * i - Math.PI / 2;
      pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(' ');
  }

  function buildAstrolabe() {
    const svg = el('svg', { viewBox: '0 0 400 400', class: 'astrolabe-svg', 'aria-hidden': 'true' });

    const outer = el('g', { class: 'astro-ring astro-outer' });
    outer.appendChild(el('circle', { cx: CX, cy: CY, r: 188, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 1.4 }));
    outer.appendChild(el('circle', { cx: CX, cy: CY, r: 172, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 0.6, opacity: 0.5 }));
    for (let i = 0; i < 72; i++) {
      const deg = i * 5;
      const isMajor = deg % 30 === 0;
      const innerR = isMajor ? 164 : (deg % 15 === 0 ? 172 : 180);
      const [x1, y1] = polarPoint(CX, CY, 188, deg);
      const [x2, y2] = polarPoint(CX, CY, innerR, deg);
      outer.appendChild(el('line', {
        x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2),
        stroke: 'var(--gold)', 'stroke-width': isMajor ? 1.2 : 0.6, opacity: isMajor ? 0.7 : 0.4
      }));
    }
    svg.appendChild(outer);

    const middle = el('g', { class: 'astro-ring astro-middle' });
    middle.appendChild(el('circle', { cx: CX, cy: CY, r: 132, fill: 'none', stroke: 'var(--teal)', 'stroke-width': 1, opacity: 0.45 }));
    for (let i = 0; i < 8; i++) {
      const [x, y] = polarPoint(CX, CY, 132, i * 45);
      middle.appendChild(el('rect', {
        x: (x - 4).toFixed(2), y: (y - 4).toFixed(2), width: 8, height: 8,
        transform: `rotate(45 ${x.toFixed(2)} ${y.toFixed(2)})`,
        fill: 'var(--gold)', opacity: 0.55
      }));
    }
    svg.appendChild(middle);

    const inner = el('g', { class: 'astro-ring astro-inner' });
    inner.appendChild(el('circle', { cx: CX, cy: CY, r: 86, fill: 'none', stroke: 'var(--gold-soft)', 'stroke-width': 1 }));
    svg.appendChild(inner);

    const pointer = el('g', { class: 'astro-ring astro-pointer' });
    const [px1, py1] = polarPoint(CX, CY, 176, 35);
    const [px2, py2] = polarPoint(CX, CY, 176, 215);
    pointer.appendChild(el('line', { x1: px1.toFixed(2), y1: py1.toFixed(2), x2: px2.toFixed(2), y2: py2.toFixed(2), stroke: 'var(--gold)', 'stroke-width': 1.4 }));
    [35, 215].forEach((deg) => {
      const [tx, ty] = polarPoint(CX, CY, 176, deg);
      pointer.appendChild(el('rect', {
        x: (tx - 5).toFixed(2), y: (ty - 5).toFixed(2), width: 10, height: 10,
        transform: `rotate(45 ${tx.toFixed(2)} ${ty.toFixed(2)})`,
        fill: 'none', stroke: 'var(--gold)', 'stroke-width': 1
      }));
    });
    svg.appendChild(pointer);

    // Invisible hit target behind the center star, so clicking
    // anywhere near it (not just the exact star shape) winds it
    const hit = el('circle', { cx: CX, cy: CY, r: 28, fill: 'transparent', class: 'astro-wind-target', style: 'cursor:pointer;' });
    svg.appendChild(hit);

    const centerStar = el('polygon', {
      points: starPoints(CX, CY, 22, 10), fill: 'var(--gold)', opacity: 0.5,
      class: 'astro-center-star', 'pointer-events': 'none'
    });
    svg.appendChild(centerStar);

    return { svg, middleEl: middle, pointerEl: pointer, hitEl: hit, centerStarEl: centerStar };
  }

  function lerpAngle(a, b, t) {
    const diff = ((b - a + 540) % 360) - 180;
    return a + diff * t;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-illumination');
    const hero = document.getElementById('hero');
    if (!container || !hero) return;

    container.innerHTML = '';
    const tiltWrap = document.createElement('div');
    tiltWrap.className = 'astro-tilt-wrap';
    const { svg, middleEl, pointerEl, hitEl, centerStarEl } = buildAstrolabe();
    tiltWrap.appendChild(svg);
    container.appendChild(tiltWrap);

    const BASE_MIDDLE_VEL  = 360 / 320;  // deg/s
    const BASE_POINTER_VEL = 360 / 200;  // deg/s
    const TRACK_DEAD_ZONE  = 26;         // px — inside this, ignore mouse
    const WIND_BOOST       = 70;         // deg/s added on click
    const DECAY            = 0.985;      // per-frame decay back to base

    let middleAngle = 0,   middleVel  = BASE_MIDDLE_VEL;
    let pointerAngle = 35, pointerVel = BASE_POINTER_VEL;
    let tracking = false, targetAngle = 0;
    let tiltX = 0, tiltY = 0, tiltTargetX = 0, tiltTargetY = 0;
    let lastTime = null;

    function frame(now) {
      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      middleAngle += middleVel * dt;
      middleVel = BASE_MIDDLE_VEL + (middleVel - BASE_MIDDLE_VEL) * Math.pow(DECAY, dt * 60);

      if (tracking) {
        pointerAngle = lerpAngle(pointerAngle, targetAngle, Math.min(dt * 6, 1));
        pointerVel = BASE_POINTER_VEL;
      } else {
        pointerAngle += pointerVel * dt;
        pointerVel = BASE_POINTER_VEL + (pointerVel - BASE_POINTER_VEL) * Math.pow(DECAY, dt * 60);
      }

      tiltX += (tiltTargetX - tiltX) * Math.min(dt * 5, 1);
      tiltY += (tiltTargetY - tiltY) * Math.min(dt * 5, 1);

      middleEl.style.transform = `rotate(${middleAngle.toFixed(2)}deg)`;
      pointerEl.style.transform = `rotate(${pointerAngle.toFixed(2)}deg)`;
      tiltWrap.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // The pointer's geometry is drawn pointing at a fixed 35°
    // (in the same "0 = up, clockwise" convention as polarPoint).
    // +90 converts standard atan2 into that convention; -35
    // corrects for that fixed drawing offset, so the rule actually
    // points AT the cursor rather than 35° off from it.
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      tracking = dist > TRACK_DEAD_ZONE;
      if (tracking) {
        targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 55;
      }

      const maxOffset = rect.width / 2;
      // NOTE: if the tilt looks backwards (leans away from the
      // cursor instead of toward it) once you see it live, just
      // flip the sign on these two lines — purely a perception
      // call, not a bug.
      tiltTargetY = Math.max(-7, Math.min(7, (dx / maxOffset) * 7));
      tiltTargetX = Math.max(-7, Math.min(7, (-dy / maxOffset) * 7));
    });

    container.addEventListener('mouseleave', () => {
      tracking = false;
      tiltTargetX = 0;
      tiltTargetY = 0;
    });

    hitEl.addEventListener('mouseenter', () => { centerStarEl.style.opacity = '0.75'; });
    hitEl.addEventListener('mouseleave', () => { centerStarEl.style.opacity = '0.5'; });
    hitEl.addEventListener('click', () => {
      middleVel += WIND_BOOST;
      pointerVel += WIND_BOOST * 1.3;
    });

    // Shadow direction/offset driven by the lamplight position,
    // dispatched from js/hero-effects.js (Phase P2 below)
    hero.addEventListener('lamplight:move', (e) => {
      const illRect = container.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const astroCx = illRect.left - heroRect.left + illRect.width / 2;
      const astroCy = illRect.top - heroRect.top + illRect.height / 2;
      const dx = astroCx - e.detail.x;
      const dy = astroCy - e.detail.y;
      const dist = Math.hypot(dx, dy) || 1;
      const offX = (dx / dist) * 12;
      const offY = (dy / dist) * 12;
      tiltWrap.style.filter = `drop-shadow(${offX.toFixed(1)}px ${offY.toFixed(1)}px 14px rgba(27,42,74,0.22))`;
    });

    hero.addEventListener('mouseleave', () => {
      tiltWrap.style.filter = '';
    });
  });
})();
