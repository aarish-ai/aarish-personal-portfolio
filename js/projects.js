(function () {
  let projects = [];
  let expandedId = null;

  function highlight(text, terms) {
    let out = text;
    terms.forEach(term => {
      const re = new RegExp(`\\b${term}\\b`, 'gi');
      out = out.replace(re, `<span class="highlight">${term}</span>`);
    });
    return out;
  }

  function renderCard(p) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = p.id;

    card.innerHTML = `
      <img class="project-card-image" src="${p.image}"
           onerror="this.style.background='linear-gradient(135deg, var(--teal), var(--ink))'; this.removeAttribute('src');"
           alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="one-liner">${p.oneLiner}</p>
      <div class="tech-tags">
        ${p.tech.slice(0,4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
    `;

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
      <img class="project-card-image" src="${p.image}"
           onerror="this.style.background='linear-gradient(135deg, var(--teal), var(--ink))'; this.removeAttribute('src');"
           alt="${p.name}">
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

    card.querySelector('.collapse-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleExpand(p.id);
    });

    return card;
  }

  function renderAll() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    projects.forEach(p => {
      const el = (expandedId === p.id) ? renderExpanded(p) : renderCard(p);
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
