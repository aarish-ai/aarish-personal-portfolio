(function () {
  let projects = [];
  let expandedId = null;
  const ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

  function highlight(text, terms) {
    let out = text;
    terms.forEach(term => {
      const re = new RegExp(`\\b${term}\\b`, 'gi');
      out = out.replace(re, `<span class="highlight">${term}</span>`);
    });
    return out;
  }

  function renderCard(p, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = p.id;

    card.innerHTML = `
      <div class="plate-mark">${ROMANS[index] || (index + 1)}</div>
      <div class="project-card-image card-art-mount"></div>
      <h3>${p.name}</h3>
      <p class="one-liner">${p.oneLiner}</p>
      <div class="tech-tags">
        ${p.tech.slice(0,4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
      <span class="corner-tick tl"></span>
      <span class="corner-tick tr"></span>
      <span class="corner-tick bl"></span>
      <span class="corner-tick br"></span>
    `;

    window.mountCardArt(card.querySelector('.card-art-mount'), p);

    card.addEventListener('click', () => {
      if (expandedId === p.id) return;
      toggleExpand(p.id);
    });

    return card;
  }

  function toggleExpand(id) {
    expandedId = (expandedId === id) ? null : id;
    renderAll();
    if (expandedId) {
      setTimeout(() => {
        document.querySelector('.project-card.expanded')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }

  function renderExpanded(p) {
    const card = document.createElement('div');
    card.className = 'project-card expanded';
    card.dataset.id = p.id;

    const highlights = p.tech || [];
    card.innerHTML = `
      <div class="project-card-image card-art-mount"></div>
      <div class="project-detail-body">
        <h3 style="font-family:var(--font-serif); font-size:28px;">${p.name}</h3>
        <p class="one-liner" style="margin-top:8px;">${p.oneLiner}</p>
        <h4>The Problem</h4>
        <p>${highlight(p.problem, highlights)}</p>
        <h4>The Approach</h4>
        <p>${highlight(p.approach, highlights)}</p>
        <h4>The Outcome</h4>
        <p>${highlight(p.outcome, highlights)}</p>
        <div class="tech-tags">
          ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        ${p.url ? `<p style="margin-top:14px;"><a href="${p.url}" target="_blank">View project →</a></p>` : ''}
        <button class="collapse-btn">Close</button>
      </div>
    `;

    window.mountCardArt(card.querySelector('.card-art-mount'), p);

    card.querySelector('.collapse-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleExpand(p.id);
    });

    return card;
  }

  function renderAll() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    projects.forEach((p, i) => {
      const el = (expandedId === p.id) ? renderExpanded(p) : renderCard(p, i);
      grid.appendChild(el);
    });
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
