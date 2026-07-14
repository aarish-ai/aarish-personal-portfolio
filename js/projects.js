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
      points.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
    }
    return points.join(' ');
  }

  const outerStarPts = generateStarPoints(35, 35, 34, 15, 0);
  const innerStarPts = generateStarPoints(25, 25, 24, 10, 22.5);

  function swapProjectDetail(index, isInitial = false) {
    const p = projects[index];
    if (!p) return;
    
    const rightPanel = document.querySelector('.desk-right-panel');
    const contentLayer = rightPanel.querySelector('.desk-content-layer');
    const folioMark = rightPanel.querySelector('.folio-mark');
    const shimmer = rightPanel.querySelector('.page-shimmer');
    
    if (!isInitial) {
      contentLayer.style.transition = 'transform 180ms ease-in, opacity 180ms ease-in';
      contentLayer.style.transform = 'translateY(-24px)';
      contentLayer.style.opacity = '0';
    }
    
    const swapDelay = isInitial ? 0 : 180;
    
    setTimeout(() => {
      if (folioMark) {
        folioMark.textContent = `Fol. ${ROMANS[index] || (index + 1)}`;
      }
      
      const firstLetter = p.name.charAt(0);
      const restName = p.name.slice(1);
      const highlights = p.tech || [];
      
      const sealsHtml = p.tech.map((t, i) => `
        <div class="wax-seal" style="opacity: 0; transform: translateY(8px);">
          <svg class="seal-svg-outer" viewBox="0 0 70 70">
            <polygon points="${outerStarPts}" />
          </svg>
          <svg class="seal-svg-inner" viewBox="0 0 50 50">
            <polygon points="${innerStarPts}" />
          </svg>
          <span>${t}</span>
        </div>
      `).join('');
      
      const pilcrow = `<svg class="section-pilcrow" viewBox="0 0 12 12"><path d="M6,0 L8,4 L12,6 L8,8 L6,12 L4,8 L0,6 L4,4 Z" /></svg>`;
      
      contentLayer.innerHTML = `
        <div class="project-title-row">
          <span class="drop-initial">${firstLetter}</span><span class="rest-name">${restName}</span>
        </div>
        <div class="desk-oneliner">
          <svg class="dash-svg" width="24" height="20" viewBox="0 0 24 20"><line x1="0" y1="10" x2="24" y2="10" stroke="var(--gold)" stroke-width="1.5" opacity="0.6"/></svg>
          ${p.oneLiner}
        </div>
        <div class="double-rule-divider"></div>
        
        <div class="section-block">
          <div class="section-heading-row">
            ${pilcrow}
            <h4>The Problem</h4>
            <div class="heading-line"></div>
          </div>
          <p>${highlight(p.problem, highlights)}</p>
        </div>
        
        <div class="section-block">
          <div class="section-heading-row">
            ${pilcrow}
            <h4>The Approach</h4>
            <div class="heading-line"></div>
          </div>
          <p>${highlight(p.approach, highlights)}</p>
        </div>
        
        <div class="section-block">
          <div class="section-heading-row">
            ${pilcrow}
            <h4>The Outcome</h4>
            <div class="heading-line"></div>
          </div>
          <p>${highlight(p.outcome, highlights)}</p>
        </div>
        
        <div class="colophon-header">
          <div class="heading-line"></div>
          <span>Instruments &amp; Methods</span>
          <div class="heading-line"></div>
        </div>
        <div class="desk-tech-tags">
          ${sealsHtml}
        </div>
        ${p.url ? `<a href="${p.url}" target="_blank" class="desk-project-link">View project →</a>` : ''}
      `;
      
      contentLayer.style.transition = 'none';
      contentLayer.style.transform = 'translateY(28px)';
      contentLayer.style.opacity = '0';
      
      const seals = contentLayer.querySelectorAll('.wax-seal');
      seals.forEach((seal, i) => {
        seal.style.transition = 'opacity 400ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';
        seal.style.transitionDelay = (300 + i * 55) + 'ms';
      });
      
      shimmer.classList.remove('active');
      void shimmer.offsetWidth;
      shimmer.classList.add('active');
      
      const incomingDelay = isInitial ? 50 : 20;
      
      setTimeout(() => {
        contentLayer.style.transition = 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)';
        contentLayer.style.transform = 'translateY(0)';
        contentLayer.style.opacity = '1';
        
        seals.forEach(seal => {
          seal.style.opacity = '1';
          seal.style.transform = 'translateY(0)';
        });
        
      }, incomingDelay);
      
    }, swapDelay);
  }

  function handleTabClick(index) {
    if (index === activeIndex) return;
    
    const tabs = document.querySelectorAll('.desk-tab');
    if (tabs[activeIndex]) tabs[activeIndex].classList.remove('active');
    activeIndex = index;
    if (tabs[activeIndex]) tabs[activeIndex].classList.add('active');
    
    swapProjectDetail(activeIndex, false);
  }

  function enhanceSectionAtmosphere() {
    const workSection = document.getElementById('work');
    if (!workSection) return;
    
    const existingFrieze = workSection.querySelector('.section-frieze');
    if (!existingFrieze) {
      const frieze = document.createElement('div');
      frieze.className = 'section-frieze';
      frieze.innerHTML = `
        <svg width="100%" height="24" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="frieze-pattern" x="0" y="0" width="40" height="24" patternUnits="userSpaceOnUse">
              <line x1="10" y1="6" x2="10" y2="18" stroke="var(--gold-soft)" stroke-width="1" opacity="0.45" />
              <polygon points="30,8 34,12 30,16 26,12" fill="none" stroke="var(--gold-soft)" stroke-width="1" opacity="0.45" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#frieze-pattern)" />
        </svg>
      `;
      workSection.insertBefore(frieze, workSection.firstChild);
    }

    const titleContainer = workSection.querySelector('h2');
    if (titleContainer && !titleContainer.querySelector('.title-star')) {
      const titleText = titleContainer.textContent.trim();
      titleContainer.innerHTML = `
        <svg class="title-star" width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 6.8,4.2 11,3 7.8,6.8 11,11 6.8,8.8 6,12 5.2,8.8 1,11 4.2,6.8 1,3 5.2,4.2" fill="var(--gold)" opacity="0.6"/></svg>
        ${titleText}
        <svg class="title-star" width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 6.8,4.2 11,3 7.8,6.8 11,11 6.8,8.8 6,12 5.2,8.8 1,11 4.2,6.8 1,3 5.2,4.2" fill="var(--gold)" opacity="0.6"/></svg>
      `;
      titleContainer.style.textAlign = 'center';
      const stars = titleContainer.querySelectorAll('.title-star');
      stars.forEach(s => {
        s.style.margin = '0 12px';
        s.style.display = 'inline-block';
        s.style.verticalAlign = 'middle';
      });
    }
  }

  function renderAll() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    
    const leftPanel = document.createElement('div');
    leftPanel.className = 'desk-left-panel';
    
    const spine = document.createElement('div');
    spine.className = 'desk-spine';
    spine.innerHTML = `
      <svg class="spine-svg" width="18" height="100%" preserveAspectRatio="none">
        <line x1="9" y1="0" x2="9" y2="100%" stroke="var(--gold-soft)" stroke-width="0.8" opacity="0.6" />
        <rect x="6.5" y="25%" width="5" height="5" fill="var(--gold)" opacity="0.4" transform="rotate(45 9 25%)" />
        <rect x="6.5" y="50%" width="5" height="5" fill="var(--gold)" opacity="0.4" transform="rotate(45 9 50%)" />
        <rect x="6.5" y="75%" width="5" height="5" fill="var(--gold)" opacity="0.4" transform="rotate(45 9 75%)" />
      </svg>
    `;
    leftPanel.appendChild(spine);
    
    projects.forEach((p, i) => {
      const tab = document.createElement('div');
      tab.className = 'desk-tab';
      if (i === activeIndex) tab.classList.add('active');
      
      tab.innerHTML = `
        <div class="ambient-glow"></div>
        <div class="tab-content">
          <div class="chapter-illumination" id="miniature-${p.id}"></div>
          <div class="row-1">
            <span class="plate-mark">${ROMANS[i] || (i + 1)}</span>
            <span class="tab-name">${p.name}</span>
          </div>
          <div class="row-2">
            <div class="tab-oneliner">${p.oneLiner}</div>
          </div>
        </div>
      `;
      
      tab.addEventListener('click', () => handleTabClick(i));
      leftPanel.appendChild(tab);
      
      if (i < projects.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'tab-divider';
        divider.setAttribute('aria-hidden', 'true');
        divider.innerHTML = `
          <svg width="100%" height="12" viewBox="0 0 100 12" preserveAspectRatio="none">
            <line x1="0" y1="6" x2="100" y2="6" stroke="var(--gold-soft)" opacity="0.4" stroke-width="1" />
            <polygon points="50,1 52,4 55,6 52,8 50,11 48,8 45,6 48,4" fill="var(--gold)" opacity="0.35" />
          </svg>
        `;
        leftPanel.appendChild(divider);
      }
    });
    
    const rightPanel = document.createElement('div');
    rightPanel.className = 'desk-right-panel';
    
    const ruledLines = document.createElement('div');
    ruledLines.className = 'ruled-lines';
    ruledLines.innerHTML = `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ruled" x="0" y="0" width="100" height="28" patternUnits="userSpaceOnUse">
            <line x1="0" y1="28" x2="1000" y2="28" stroke="var(--gold-soft)" stroke-width="0.4" opacity="0.18" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#ruled)" />
      </svg>
    `;
    rightPanel.appendChild(ruledLines);
    
    const folioMark = document.createElement('div');
    folioMark.className = 'folio-mark';
    folioMark.textContent = `Fol. ${ROMANS[activeIndex] || 1}`;
    rightPanel.appendChild(folioMark);
    
    const shimmer = document.createElement('div');
    shimmer.className = 'page-shimmer';
    rightPanel.appendChild(shimmer);
    
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
            swapProjectDetail(activeIndex, true);
          }, 250);
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
      
      projects.forEach(p => {
        const mini = document.getElementById(`miniature-${p.id}`);
        if (mini && typeof window.renderCardArt === 'function') {
          window.renderCardArt(mini, p.id);
        }
      });
      
      enhanceSectionAtmosphere();
      
      if (typeof renderTessellation === 'function') {
        renderTessellation(projects.length);
      }
    });
})();