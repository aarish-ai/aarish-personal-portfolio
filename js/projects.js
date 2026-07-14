(function () {
  let projects = [];
  let activeIndex = 0;
  const ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

  function highlight(text, terms) {
    let out = text;
    terms.forEach(term => {
      const re = new RegExp(`\\b${term}\\b`, 'gi');
      out = out.replace(re, `<span class="highlight">${term}</span>`);
    });
    return out;
  }

  function swapProjectDetail(index) {
    const p = projects[index];
    if (!p) return;
    
    const rightPanel = document.querySelector('.desk-right-panel');
    const contentLayer = rightPanel.querySelector('.desk-content-layer');
    
    // Create ink spread
    const inkSpread = document.createElement('div');
    inkSpread.className = 'ink-spread-layer';
    rightPanel.appendChild(inkSpread);
    
    // Trigger spread
    requestAnimationFrame(() => {
      // Force layout recalculation so the transition works
      inkSpread.getBoundingClientRect();
      inkSpread.style.transition = 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease';
      inkSpread.style.transform = 'scale(150)';
      inkSpread.style.opacity = '0.06';
    });
    
    // Fade out old
    contentLayer.style.transition = 'opacity 180ms ease';
    contentLayer.style.opacity = '0';
    
    setTimeout(() => {
      // Build new content
      const firstLetter = p.name.charAt(0);
      const restName = p.name.slice(1);
      const highlights = p.tech || [];
      
      const sealsHtml = p.tech.map(t => `
        <div class="desk-seal-stamp">
          <svg viewBox="0 0 100 100">
            <polygon points="50,8 56.89,33.37 79.70,20.30 66.63,43.11 92,50 66.63,56.89 79.70,79.70 56.89,66.63 50,92 43.11,66.63 20.30,79.70 33.37,56.89 8,50 33.37,43.11 20.30,20.30 43.11,33.37" />
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
        <div class="desk-tech-tags">
          ${sealsHtml}
        </div>
        ${p.url ? `<a href="${p.url}" target="_blank" class="desk-project-link">View project →</a>` : ''}
      `;
      
      // Fade in new
      contentLayer.style.transition = 'opacity 220ms ease';
      contentLayer.style.opacity = '1';
      
      // Fade out ink
      setTimeout(() => {
        inkSpread.style.opacity = '0';
        setTimeout(() => {
          inkSpread.remove();
        }, 280);
      }, 100);
    }, 200);
  }

  function handleTabClick(index) {
    if (index === activeIndex) return;
    
    // Animate tabs
    const tabs = document.querySelectorAll('.desk-tab');
    if (tabs[activeIndex]) tabs[activeIndex].classList.remove('active');
    activeIndex = index;
    if (tabs[activeIndex]) tabs[activeIndex].classList.add('active');
    
    // Animate content
    swapProjectDetail(activeIndex);
  }

  function renderAll() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    
    // Left panel
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
      `;
      
      tab.addEventListener('click', () => handleTabClick(i));
      leftPanel.appendChild(tab);
    });
    
    // Right panel
    const rightPanel = document.createElement('div');
    rightPanel.className = 'desk-right-panel';
    
    const contentLayer = document.createElement('div');
    contentLayer.className = 'desk-content-layer';
    contentLayer.style.opacity = '0'; // Initial state before swap
    rightPanel.appendChild(contentLayer);
    
    grid.appendChild(leftPanel);
    grid.appendChild(rightPanel);
    
    // Initial load
    swapProjectDetail(activeIndex);
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
