(function () {
  
  const ns = "http://www.w3.org/2000/svg";
  
  function createEl(tag, attrs) {
    const el = document.createElementNS(ns, tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  
  function starPoints(cx, cy, outerR, innerR, pointsCount = 16) {
    let pts = [];
    for (let i = 0; i < pointsCount; i++) {
      let r = (i % 2 === 0) ? outerR : innerR;
      let angle = (i * Math.PI / (pointsCount/2)) - Math.PI / 2;
      pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
    }
    return pts.join(' ');
  }
  
  function setupRosette() {
    const svg = document.getElementById('rosette-svg');
    if (!svg) return;
    
    // We will build the layers here.
    
    // LAYER 0
    const l0 = createEl('g', { id: 'layer-0' });
    const c0 = createEl('circle', { cx: 300, cy: 300, r: 275, fill: 'none', stroke: 'var(--gold-soft)', 'stroke-width': '0.5', opacity: '0.15' });
    l0.appendChild(c0);
    svg.appendChild(l0);
    
    // LAYER 1 (Inner Star Core)
    const l1 = createEl('g', { id: 'layer-1', style: 'transform-box: fill-box; transform-origin: center;' });
    const s1_outer = createEl('polygon', { points: starPoints(300, 300, 60, 25, 16), fill: 'var(--gold)', opacity: '0.675' });
    const s1_inner = createEl('polygon', { points: starPoints(300, 300, 38, 16, 16), fill: 'none', stroke: 'var(--ivory)', 'stroke-width': '0.6', opacity: '0.3' });
    l1.appendChild(s1_outer);
    l1.appendChild(s1_inner);
    svg.appendChild(l1);
    
    // LAYER 2 (Inner Ring)
    const l2 = createEl('g', { id: 'layer-2', style: 'transform-box: fill-box; transform-origin: center;' });
    for (let i = 0; i < 8; i++) {
      let angle = i * Math.PI / 4;
      let angleDeg = i * 45;
      
      // kite
      const kite = createEl('polygon', { 
        points: `300,245 286,190 300,190 314,190`, // Needs correct radial mapping
        fill: 'none', stroke: 'var(--gold)', 'stroke-width': '1', opacity: '0.4875',
        transform: `rotate(${angleDeg} 300 300)`
      });
      // The kite base is at r=110, tip at r=55. Width at base 28 => +-14.
      // So relative to 300,300, tip is (300, 300-55) = (300, 245). Base is (300, 300-110) = (300, 190).
      // Corners at base are (300-14, 190) and (300+14, 190).
      // Wait, is it a kite? A kite has 4 points. tip, left base, bottom base? 
      // "tip at r=55, base at r=110, width at base: 28px."
      // So points: (300, 245) [tip], (286, 190) [left], (300, 190) [center-base? Or maybe no center base if it's a triangle, but it says kite/rhombus].
      // Let's make it a kite: top tip at r=55, side points at r=110 width 28, bottom tip at r=130?
      // Just a triangle pointing outward: 300,245 286,190 314,190
      kite.setAttribute('points', `300,245 286,190 314,190`);
      l2.appendChild(kite);
      
      // circle between kites at r=85. Halfway between angles.
      let midAngle = angle + (Math.PI/8);
      let cx = 300 + 85 * Math.sin(midAngle);
      let cy = 300 - 85 * Math.cos(midAngle);
      const dot = createEl('circle', { cx: cx, cy: cy, r: 4, fill: 'var(--gold)', opacity: '0.375' });
      l2.appendChild(dot);
    }
    svg.appendChild(l2);
    
    // LAYER 3 (Middle Ring)
    const l3 = createEl('g', { id: 'layer-3', style: 'transform-box: fill-box; transform-origin: center;' });
    const s3 = createEl('polygon', { points: starPoints(300, 300, 145, 110, 32), fill: 'none', stroke: 'var(--gold)', 'stroke-width': '1.2', opacity: '0.4125' });
    l3.appendChild(s3);
    // petals
    for (let i = 0; i < 8; i++) {
       // Just creating circles for simplicity, clipping or intersecting would be complex without paths
       let angle = i * Math.PI / 4;
       let cx = 300 + 130 * Math.sin(angle);
       let cy = 300 - 130 * Math.cos(angle);
       let petal = createEl('circle', { cx: cx, cy: cy, r: 25, fill: 'var(--gold)', opacity: '0.045', stroke: 'var(--gold-soft)', 'stroke-width': '0.8', 'stroke-opacity': '0.35' });
       // to insert behind s3, we can insert before
       l3.insertBefore(petal, s3);
    }
    svg.appendChild(l3);
    
    // LAYER 4 (Outer Geometric Band)
    const l4 = createEl('g', { id: 'layer-4', style: 'transform-box: fill-box; transform-origin: center;' });
    const c4_1 = createEl('circle', { cx: 300, cy: 300, r: 190, fill: 'none', stroke: 'var(--gold-soft)', 'stroke-width': '0.6', opacity: '0.225' });
    const c4_2 = createEl('circle', { cx: 300, cy: 300, r: 220, fill: 'none', stroke: 'var(--gold-soft)', 'stroke-width': '0.6', opacity: '0.225' });
    l4.appendChild(c4_1);
    l4.appendChild(c4_2);
    
    for (let i = 0; i < 24; i++) {
      let isMajor = i % 3 === 0;
      let r1 = 190;
      let r2 = isMajor ? 220 : 205;
      let angle = i * Math.PI / 12;
      let x1 = 300 + r1 * Math.sin(angle);
      let y1 = 300 - r1 * Math.cos(angle);
      let x2 = 300 + r2 * Math.sin(angle);
      let y2 = 300 - r2 * Math.cos(angle);
      const line = createEl('line', { x1, y1, x2, y2, stroke: 'var(--gold)', opacity: '0.3375', 'stroke-width': isMajor ? '1.2' : '0.8' });
      l4.appendChild(line);
      
      if (i % 3 === 0) {
        // cardinal diamond at r=205
        let cx = 300 + 205 * Math.sin(angle);
        let cy = 300 - 205 * Math.cos(angle);
        let diamond = createEl('rect', { x: cx-4, y: cy-4, width: 8, height: 8, fill: 'var(--gold)', opacity: '0.45', transform: `rotate(45 ${cx} ${cy})`});
        l4.appendChild(diamond);
      }
    }
    svg.appendChild(l4);
    
    // LAYER 5 (Outer Star)
    const l5 = createEl('g', { id: 'layer-5', style: 'transform-box: fill-box; transform-origin: center;' });
    const s5_1 = createEl('polygon', { points: starPoints(300, 300, 255, 195, 16), fill: 'none', stroke: 'var(--teal)', 'stroke-width': '1', opacity: '0.3' });
    const s5_2 = createEl('polygon', { points: starPoints(300, 300, 265, 200, 16), fill: 'none', stroke: 'var(--gold-soft)', 'stroke-width': '0.5', opacity: '0.1875', transform: 'rotate(22.5 300 300)' });
    l5.appendChild(s5_1);
    l5.appendChild(s5_2);
    svg.appendChild(l5);
    
    // LAYER 6 (Outer Circle Border)
    const l6 = createEl('g', { id: 'layer-6', style: 'transform-box: fill-box; transform-origin: center;' });
    const c6 = createEl('circle', { cx: 300, cy: 300, r: 275, fill: 'none', stroke: 'var(--gold)', 'stroke-width': '0.8', 'stroke-dasharray': '4 6', opacity: '0.2625' });
    l6.appendChild(c6);
    svg.appendChild(l6);
    
    // Setup animation
    
    // Radial Mist Layer
    const defs = createEl('defs', {});
    const rg = createEl('radialGradient', { id: 'rosette-mist', cx: '50%', cy: '50%', r: '50%' });
    rg.innerHTML = `
      <stop offset="0%" stop-color="#080F1C" stop-opacity="0.0"/>
      <stop offset="55%" stop-color="#080F1C" stop-opacity="0.0"/>
      <stop offset="80%" stop-color="#080F1C" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#080F1C" stop-opacity="0.82"/>
    `;
    defs.appendChild(rg);
    svg.appendChild(defs);
    const mistRect = createEl('rect', { width: '600', height: '600', fill: 'url(#rosette-mist)', 'pointer-events': 'none' });
    svg.appendChild(mistRect);
    
    // Set base svg opacity
    svg.style.opacity = '0.42';

    setupDrawIn(svg);
    startRotation(l1, l2, l3, l4, l5, l6);
  }
  
  function setupDrawIn(svg) {
    // The prompt specifies a sequence of drawing in.
    const layers = [
      { id: 'layer-6', delay: 0, duration: 800 },
      { id: 'layer-5', delay: 300, duration: 700 },
      { id: 'layer-4', delay: 600, duration: 600 },
      { id: 'layer-3', delay: 900, duration: 600 },
      { id: 'layer-2', delay: 1200, duration: 500 },
      { id: 'layer-1', delay: 1500, duration: 500 },
    ];
    
    layers.forEach(l => {
      const g = document.getElementById(l.id);
      if (!g) return;
      
      const shapes = g.querySelectorAll('path, polygon, circle, line, rect');
      shapes.forEach(shape => {
        let length = 0;
        if (shape.getTotalLength) {
          length = shape.getTotalLength();
        } else {
          length = 2000; // fallback
        }
        
        let targetOpacity = shape.getAttribute('opacity') || shape.style.opacity || '1';
        shape.setAttribute('data-target-opacity', targetOpacity);
        
        shape.style.strokeDasharray = `${length}`;
        shape.style.strokeDashoffset = `${length}`;
        shape.style.opacity = '0';
        
        // Wait and then animate
        setTimeout(() => {
          shape.style.transition = `stroke-dashoffset ${l.duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${l.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          shape.style.strokeDashoffset = '0';
          
          if (l.id === 'layer-1' && shape.getAttribute('fill') !== 'none') {
             // Center star fill fades in at 1800ms, 400ms duration (so delay + 300)
             setTimeout(() => {
                shape.style.transition = `opacity 400ms ease`;
                shape.style.opacity = targetOpacity;
             }, 300);
          } else {
             shape.style.opacity = targetOpacity;
          }
          
        }, l.delay);
      });
    });
  }
  
  let animationFrame;
  let lastTime = 0;
  
  let angles = [0, 0, 0, 0, 0, 0];
  
  function startRotation(l1, l2, l3, l4, l5, l6) {
    const speeds = [
      (360 / 120),  // layer 1
      -(360 / 90),  // layer 2
      (360 / 70),   // layer 3
      -(360 / 180), // layer 4
      (360 / 240),  // layer 5
      -(360 / 300)  // layer 6
    ];
    
    function tick(time) {
      if (!lastTime) lastTime = time;
      const dt = (time - lastTime) / 1000; // seconds
      lastTime = time;
      
      const layers = [l1, l2, l3, l4, l5, l6];
      for (let i = 0; i < 6; i++) {
        angles[i] += dt * speeds[i] * (window.rosetteSpeedMultiplier || 1);
        if (layers[i]) {
          layers[i].style.transform = `rotate(${angles[i]}deg)`;
        }
      }
      
      animationFrame = requestAnimationFrame(tick);
    }
    animationFrame = requestAnimationFrame(tick);
  }
  
  
  window.rosetteSpeedMultiplier = 1;

  function unfoldRosette(callback) {
    const svg = document.getElementById('rosette-svg');
    const wrap = document.getElementById('rosette-wrap');
    if (!svg || !wrap) return;

    const layer0El = document.getElementById('layer-0');
    const layer1El = document.getElementById('layer-1');
    const layer2El = document.getElementById('layer-2');
    const layer3El = document.getElementById('layer-3');
    const layer4El = document.getElementById('layer-4');
    const layer5El = document.getElementById('layer-5');
    const layer6El = document.getElementById('layer-6');

    window.rosetteSpeedMultiplier = 8;
    layer6El.style.transition = 'opacity 250ms ease-in';
    layer5El.style.transition = 'opacity 250ms ease-in';
    layer6El.style.opacity = '0';
    layer5El.style.opacity = '0';

    layer3El.style.transition = 'opacity 300ms ease-in, transform 300ms ease-in';
    layer4El.style.transition = 'opacity 300ms ease-in, transform 300ms ease-in';
    setTimeout(() => {
      layer3El.style.opacity = '0';
      layer4El.style.opacity = '0';
      layer3El.style.transform += ' scale(0.3)';
      layer4El.style.transform += ' scale(0.3)';
    }, 150);

    setTimeout(() => {
      layer1El.style.transition = 'opacity 250ms ease-in, transform 250ms ease-in';
      layer2El.style.transition = 'opacity 250ms ease-in, transform 250ms ease-in';
      layer1El.style.opacity = '0';
      layer2El.style.opacity = '0';
      layer1El.style.transform += ' scale(0.1)';
      layer2El.style.transform += ' scale(0.1)';
    }, 350);

    setTimeout(() => {
      layer0El.style.transition = 'transform 300ms cubic-bezier(0.4,0,1,1), opacity 300ms ease';
      layer0El.style.transform = 'scale(0)';
      layer0El.style.opacity = '0';
    }, 500);

    setTimeout(() => {
      wrap.style.position = 'fixed';
      wrap.style.transition = 'top 500ms cubic-bezier(0.16,1,0.3,1), left 500ms cubic-bezier(0.16,1,0.3,1), right 500ms cubic-bezier(0.16,1,0.3,1), width 500ms cubic-bezier(0.16,1,0.3,1), height 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)';
      wrap.style.top = '20px';
      wrap.style.left = 'auto';
      wrap.style.right = '24px';
      wrap.style.width = '36px';
      wrap.style.height = '36px';
      wrap.style.transform = 'none';

      layer1El.style.transition = 'opacity 400ms ease';
      layer1El.style.transform = '';
      setTimeout(() => {
        layer1El.style.opacity = '0.9';
        svg.style.opacity = '1';
        layer0El.style.transition = 'opacity 300ms ease, transform 300ms ease';
        layer0El.style.transform = '';
        layer0El.style.opacity = '0.6';
      }, 200);

    }, 750);

    setTimeout(() => {
      wrap.style.cursor = 'pointer';
      wrap.style.zIndex = '600';
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('aria-label', 'Contact');
      wrap.setAttribute('tabindex', '0');
      
      if (!wrap.dataset.contactBound) {
        wrap.addEventListener('click', () => {
          if (typeof window.openContactPanel === 'function') window.openContactPanel();
          else document.getElementById('contact-seal')?.click();
        });
        wrap.dataset.contactBound = 'true';
      }
      
      if (!wrap.querySelector('.rosette-contact-label')) {
        const label = document.createElement('span');
        label.className = 'rosette-contact-label';
        label.textContent = 'Contact';
        wrap.appendChild(label);
      }
      if (callback) callback();
    }, 1150);
  }

  window.unfoldRosette = unfoldRosette;

  window.restoreRosette = function(callback) {
    const svg = document.getElementById('rosette-svg');
    const wrap = document.getElementById('rosette-wrap');
    if (!svg || !wrap) return;

    window.rosetteSpeedMultiplier = 1;
    wrap.style.transition = 'opacity 400ms ease';
    wrap.style.opacity = '0';

    setTimeout(() => {
      wrap.style.position = 'absolute';
      wrap.style.top = '50%';
      wrap.style.left = '50%';
      wrap.style.right = 'auto';
      wrap.style.transform = 'translate(-50%, -50%)';
      wrap.style.width = 'min(560px, 90vw)';
      wrap.style.height = 'min(560px, 90vw)';
      wrap.style.cursor = 'default';
      wrap.style.zIndex = '0';
      wrap.removeAttribute('role');
      wrap.removeAttribute('tabindex');

      const label = wrap.querySelector('.rosette-contact-label');
      if (label) label.remove();

      const l0 = document.getElementById('layer-0');
      const l1 = document.getElementById('layer-1');
      const l2 = document.getElementById('layer-2');
      const l3 = document.getElementById('layer-3');
      const l4 = document.getElementById('layer-4');
      const l5 = document.getElementById('layer-5');
      const l6 = document.getElementById('layer-6');
      
      l0.style.transition = 'none'; l0.style.transform = ''; l0.style.opacity = '0.15';
      l1.style.transition = 'none'; l1.style.transform = ''; l1.style.opacity = '1';
      l2.style.transition = 'none'; l2.style.transform = ''; l2.style.opacity = '1';
      l3.style.transition = 'none'; l3.style.transform = ''; l3.style.opacity = '1';
      l4.style.transition = 'none'; l4.style.transform = ''; l4.style.opacity = '1';
      l5.style.transition = 'none'; l5.style.transform = ''; l5.style.opacity = '1';
      l6.style.transition = 'none'; l6.style.transform = ''; l6.style.opacity = '1';

      // base opacity restored
      svg.style.opacity = '0.42';
      
      setTimeout(() => {
         wrap.style.opacity = '1';
         if (callback) callback();
      }, 50);

    }, 400);
  }

  document.addEventListener('DOMContentLoaded', setupRosette);
  
})();
