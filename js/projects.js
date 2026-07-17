(function () {
  let projects = [];
  const ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

  function highlight(text, terms) {
    let out = text;
    terms.forEach(term => {
      const re = new RegExp(`\\b${term}\\b`, 'gi');
      out = out.replace(re, `<span class="highlight">${term}</span>`);
    });
    return out;
  }

  function renderDeck() {
    const container = document.getElementById('deck-container');
    const sentinel = document.getElementById('deck-scroll-sentinel');
    if (!container || !sentinel) return;

    sentinel.style.height = `${projects.length * 100}vh`;

    projects.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'project-page';
      card.id = `project-card-${i}`;
      
      const firstLetter = p.name.charAt(0);
      const restName = p.name.slice(1);
      const highlights = p.tech || [];
      
      const pillsHtml = p.tech.map(t => `<span class="tech-pill">${t}</span>`).join('');
      
      const pilcrow = `<svg width="8" height="8" viewBox="0 0 12 12" style="fill: var(--gold); margin-right: 6px;"><path d="M6,0 L8,4 L12,6 L8,8 L6,12 L4,8 L0,6 L4,4 Z" /></svg>`;
      
      card.innerHTML = `
        <div class="folio-notation">Fol. ${ROMANS[i] || (i+1)}</div>
        
        <div class="project-title">
          <span class="drop-cap">${firstLetter}</span>${restName}
        </div>
        
        <div class="one-liner">
          <div class="line-dash"></div>
          ${p.oneLiner}
        </div>
        
        <div class="double-rule-divider"></div>
        
        <div class="section-block">
          <h4 class="section-heading">${pilcrow}The Problem</h4>
          <p>${highlight(p.problem, highlights)}</p>
        </div>
        
        <div class="section-block">
          <h4 class="section-heading">${pilcrow}The Approach</h4>
          <p>${highlight(p.approach, highlights)}</p>
        </div>
        
        <div class="section-block">
          <h4 class="section-heading">${pilcrow}The Outcome</h4>
          <p>${highlight(p.outcome, highlights)}</p>
        </div>
        
        <div class="tech-pill-row">
          <span class="row-label">Built with —</span>
          ${pillsHtml}
        </div>
        
        ${p.url ? `<a href="${p.url}" target="_blank" class="project-link">View project →</a>` : ''}
      `;
      
      container.appendChild(card);
    });

    const sweepLine = document.createElement('div');
    sweepLine.className = 'sweep-line';
    container.appendChild(sweepLine);

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateDeck);
    });
    // Initial call
    updateDeck();
  }

  let lastActiveIndex = 0;
  let sweepLineActive = false;

  function updateDeck() {
    const sentinel = document.getElementById('deck-scroll-sentinel');
    const container = document.getElementById('deck-container');
    const sweepLine = container.querySelector('.sweep-line');
    if (!sentinel) return;

    const rect = sentinel.getBoundingClientRect();
    const totalScroll = sentinel.offsetHeight - window.innerHeight;
    
    // scrolled is how far the top of the sentinel has gone past the top of the viewport
    // Wait, the sticky container keeps deck-container fixed, but sentinel scrolls up.
    // If sentinel top is 0, progress = 0.
    const scrolled = -rect.top;
    
    // We only care when sentinel is within the viewport or above it
    if (scrolled < 0) {
      // not yet reached
      applyTransforms(-1, 0); // show first card fully
      return;
    }
    
    let progress = Math.max(0, Math.min(1, scrolled / totalScroll));
    if (totalScroll <= 0) progress = 0;
    
    const projectProgress = progress * (projects.length - 1); // length - 1 because last card doesn't scroll off
    const activeIndex = Math.floor(projectProgress);
    const cardProgress = projectProgress - activeIndex;

    const clipRect = document.getElementById('progress-clip-rect');
    if (clipRect) {
      const fillHeight = progress * 40;
      clipRect.setAttribute('y', 40 - fillHeight);
      clipRect.setAttribute('height', fillHeight);
    }
    
    const progressStar = document.getElementById('progress-star');
    if (progressStar) {
      if (progress > 0 && progress < 1) {
        progressStar.style.opacity = '1';
        progressStar.style.transform = 'scale(1)';
      } else if (progress === 1) {
        // pulse
        if (progressStar.dataset.pulsed !== 'true') {
          progressStar.dataset.pulsed = 'true';
          progressStar.style.transition = 'opacity 400ms ease, transform 300ms ease';
          progressStar.style.transform = 'scale(1.3)';
          progressStar.style.opacity = '1';
          setTimeout(() => {
             progressStar.style.transform = 'scale(1)';
             setTimeout(() => { progressStar.style.opacity = '0'; }, 300);
          }, 300);
        }
      } else {
        progressStar.style.opacity = '0';
        progressStar.dataset.pulsed = 'false';
      }
    }


    applyTransforms(activeIndex, cardProgress);

    // Trigger sweep line between transitions
    if (cardProgress > 0.4 && cardProgress < 0.6 && activeIndex !== lastActiveIndex) {
      if (!sweepLineActive) {
        sweepLineActive = true;
        sweepLine.style.animation = 'sweep-flash 300ms ease';
        setTimeout(() => {
          sweepLine.style.animation = 'none';
          sweepLineActive = false;
        }, 300);
      }
      lastActiveIndex = activeIndex;
    }
  }

  function applyTransforms(activeIndex, cardProgress) {
    if (activeIndex < 0) {
      activeIndex = 0;
      cardProgress = 0;
    }
    
    projects.forEach((_, i) => {
      const card = document.getElementById(`project-card-${i}`);
      if (!card) return;
      
      const totalCards = projects.length;
      card.style.zIndex = totalCards - i;
      
      if (i < activeIndex) {
        // Card has been scrolled off
        card.style.transform = `translateY(-60px) rotate(-2deg)`;
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      } else if (i === activeIndex) {
        // Currently exiting card
        // Interpolate out
        const yOffset = -60 * cardProgress;
        const rotOffset = -2 * cardProgress;
        const opacity = 1 - (cardProgress * 1.5); // fades slightly faster
        card.style.transform = `translateY(${yOffset}px) rotate(${rotOffset}deg)`;
        card.style.opacity = Math.max(0, opacity).toString();
        card.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      } else {
        // Cards waiting in stack
        // Their index relative to active:
        const relIdx = i - activeIndex;
        // As cardProgress goes 0->1, they move up one slot.
        // position(relIdx) at 0 progress = offset for relIdx
        // position(relIdx) at 1 progress = offset for relIdx - 1
        
        // Let's interpolate:
        const currentPos = relIdx - cardProgress;
        
        const yOffset = 16 * currentPos;
        const scale = Math.max(0.9, 1 - (0.03 * currentPos));
        
        // Base opacity: front card is 1, rest are 0.6
        // Transition front-most waiting card from 0.6 -> 1
        let opacity = 0.6;
        if (relIdx === 1) {
          opacity = 0.6 + (0.4 * cardProgress);
        }
        
        card.style.transform = `translateY(${yOffset}px) scale(${scale})`;
        card.style.opacity = opacity.toString();
        card.style.pointerEvents = 'none';
      }
    });
  }

  let rosetteUnfolded = false;
  window.rosetteUnfolded = false;

  function updateHeroScroll() {
    const work = document.getElementById('work');
    const fixedContactBtn = document.getElementById('contact-fixed-btn'); // may be unused now if wrap is the button, but we leave it
    if (!work) return;
    
    const rect = work.getBoundingClientRect();
    const threshold = window.innerHeight * 0.85; 
    
    if (rect.top < threshold) {
      if (!rosetteUnfolded && typeof window.unfoldRosette === 'function') {
        rosetteUnfolded = true;
        window.rosetteUnfolded = true;
        window.unfoldRosette();
        if (fixedContactBtn) {
          fixedContactBtn.style.opacity = '1';
          fixedContactBtn.style.pointerEvents = 'auto';
        }
      }
    } else {
      if (rosetteUnfolded && typeof window.restoreRosette === 'function') {
        rosetteUnfolded = false;
        window.rosetteUnfolded = false;
        window.restoreRosette();
        if (fixedContactBtn) {
          fixedContactBtn.style.opacity = '0';
          fixedContactBtn.style.pointerEvents = 'none';
        }
      }
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateHeroScroll);
  });

  // Attach fixed contact button logic
  document.addEventListener('DOMContentLoaded', () => {
    const fixedBtn = document.getElementById('contact-fixed-btn');
    if (fixedBtn && typeof window.openContactPanel === 'function') {
      fixedBtn.addEventListener('click', window.openContactPanel);
    }
    // ensure hero contact seal also works
    const heroBtn = document.getElementById('contact-seal');
    if (heroBtn && typeof window.openContactPanel === 'function') {
       heroBtn.addEventListener('click', window.openContactPanel);
    }
  });

  fetch('data/projects.json')
    .then(r => r.json())
    .then(data => {
      projects = data;
      renderDeck();
    });
})();