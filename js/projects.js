(function () {
  let projects = [];
  let activeIndex = 0;
  let initialLoadDone = false;
  const ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

  function highlight(text, terms) {
    let out = text;
    terms.forEach(term => {
      const re = new RegExp(`\\b${term}\\b`, 'gi');
      out = out.replace(re, `<span class="highlight">${term}</span>`);
    });
    return out;
  }

  function generateStarPoints(cx, cy, outerR, innerR, offsetAngle = 0) {
    let points = [];
    for (let i = 0; i < 16; i++) {
      let angle = (i * Math.PI / 8) - Math.PI / 2 + (offsetAngle * Math.PI / 180);
      let r = (i % 2 === 0) ? outerR : innerR;
      points.push(`${cx + r * Math.cos(angle).toFixed(2)},${cy + r * Math.sin(angle).toFixed(2)}`);
    }
    return points.join(' ');
  }

  const outerStarPts = generateStarPoints(31, 31, 30, 13, 0);
  const innerStarPts = generateStarPoints(22, 22, 21, 9, 22.5);

  function swapProjectDetail(index) {
    const p = projects[index];
    if (!p) return;
    
    const rightPanel = document.querySelector('.desk-right-panel');
    const contentLayer = rightPanel.querySelector('.desk-content-layer');
    
    // Step 1: Inject ink bloom
    const inkBloom = document.createElement('div');
    inkBloom.className = 'ink-bloom';
    const inkDrop = document.createElement('div');
    inkDrop.className = 'ink-drop';
    inkBloom.appendChild(inkDrop);
    rightPanel.appendChild(inkBloom);
    
    // Step 2: Fade existing content
    contentLayer.style.transition = 'opacity 200ms ease';
    contentLayer.style.opacity = '0';
    
    // Step 3: Trigger spread on next frame
    requestAnimationFrame(() => {
      inkDrop.getBoundingClientRect(); // force layout
      inkDrop.style.transform = 'translate(-50%, -50%) scale(90)';
      inkDrop.style.transition = 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    // Step 4: Swap content
    setTimeout(() => {
      const firstLetter = p.name.charAt(0);
      const restName = p.name.slice(1);
      const highlights = p.tech || [];
      
      const sealsHtml = p.tech.map((t, i) => `
        <div class="desk-seal-stamp" style="animation-delay: ${i * 60}ms;">
          <svg class="seal-svg-outer" viewBox="0 0 62 62">
            <polygon points="${outerStarPts}" />
          </svg>
          <svg class="seal-svg-inner" viewBox="0 0 44 44">
            <polygon points="${innerStarPts}" />
          </svg>
          <span>${t}</span>
        </div>
      `).join('');
      
      contentLayer.innerHTML = `
        <h2><span class="drop-cap">${firstLetter}</span>${restName}</h2>
        <div class="desk-oneliner">${p.oneLiner}</div>
        <div class="desk-hairline"></div>
        <h4>The Problem</h4>
        <p>${highlight(p.problem, highlights)}</p>
        <h4>The Approach</h4>
        <p>${highlight(p.approach, highlights)}</p>
        <h4>The Outcome</h4>
        <p>${highlight(p.outcome, highlights)}</p>
        <div class="seals-header">Built with</div>
        <div class="desk-tech-tags">
          ${sealsHtml}
        </div>
        ${p.url ? `<a href="${p.url}" target="_blank" class="desk-project-link">View project →</a>` : ''}
      `;
      contentLayer.style.transition = 'none';
      contentLayer.style.opacity = '0';
    }, 220);

    // Step 5: Fade content back to 1
    setTimeout(() => {
      contentLayer.style.transition = 'opacity 280ms ease';
      contentLayer.style.opacity = '1';
    }, 240);

    // Step 6: Fade ink bloom
    setTimeout(() => {
      inkBloom.style.opacity = '0';
    }, 480);
    
    // Step 7: Remove ink bloom
    setTimeout(() => {
      inkBloom.remove();
    }, 680);
  }

  function handleTabClick(index) {
    if (index === activeIndex) return;
    
    const tabs = document.querySelectorAll('.desk-tab');
    if (tabs[activeIndex]) tabs[activeIndex].classList.remove('active');
    activeIndex = index;
    if (tabs[activeIndex]) tabs[activeIndex].classList.add('active');
    
    swapProjectDetail(activeIndex);
  }

  function renderAll() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    
    const leftPanel = document.createElement('div');
    leftPanel.className = 'desk-left-panel';
    
    projects.forEach((p, i) => {
      const tab = document.createElement('button');
      tab.className = 'desk-tab';
      if (i === activeIndex) tab.classList.add('active');
      
      tab.innerHTML = `
        <div class="plate-mark">${ROMANS[i] || (i + 1)}</div>
        <h3>${p.name}</h3>
        <p class="tab-oneliner">${p.oneLiner}</p>
        <svg class="tab-star" viewBox="0 0 100 100">
          <polygon points="50,8 56.89,33.37 79.70,20.30 66.63,43.11 92,50 66.63,56.89 79.70,79.70 56.89,66.63 50,92 43.11,66.63 20.30,79.70 33.37,56.89 8,50 33.37,43.11 20.30,20.30 43.11,33.37" />
        </svg>
      `;
      
      tab.addEventListener('click', () => handleTabClick(i));
      leftPanel.appendChild(tab);
    });
    
    const rightPanel = document.createElement('div');
    rightPanel.className = 'desk-right-panel';
    
    const contentLayer = document.createElement('div');
    contentLayer.className = 'desk-content-layer';
    contentLayer.style.opacity = '0'; 
    rightPanel.appendChild(contentLayer);
    
    grid.appendChild(leftPanel);
    grid.appendChild(rightPanel);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !initialLoadDone) {
          initialLoadDone = true;
          setTimeout(() => {
            swapProjectDetail(activeIndex);
          }, 300);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(grid);
  }

  fetch('data/projects.json')
    .then(r => r.json())
    .then(data => {
      projects = data;
      renderAll();
      if (typeof renderTessellation === 'function') {
        renderTessellation(projects.length);
      }
    });
})();