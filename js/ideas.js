document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.initRipple === 'function') {
    window.initRipple('ripple-bg');
  }

  const backBtn = document.getElementById('back-btn');
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 400ms ease';
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 420);
  });

  const grid = document.getElementById('ideas-grid');
  let loadedIdeas = [];

  fetch('data/ideas.json')
    .then(r => r.json())
    .then(ideas => {
      loadedIdeas = ideas;
      renderIdeas(ideas);
    })
    .catch(err => {
      console.error('Error fetching ideas:', err);
      renderIdeas([]);
    });

  function renderIdeas(ideas) {
    grid.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
      const idea = ideas[i];
      const quadrant = document.createElement('div');
      quadrant.className = 'quadrant';
      quadrant.dataset.ideaIndex = i;
      
      if (idea) {
        quadrant.innerHTML = \`
          <button class="run-btn">run</button>
          <div class="sig-line">
            <span class="kw">def </span>
            <span class="idea-name">\${idea.name}</span>
            <span class="colon">:</span>
          </div>
          <div class="desc-line">
            <span class="desc-kw">desc = </span>
            <span class="quote">"</span><span class="idea-desc">\${idea.shortDesc}</span><span class="quote">"</span>
          </div>
          <div class="idea-terminal" data-running="false"></div>
        \`;

        const runBtn = quadrant.querySelector('.run-btn');
        runBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const terminal = quadrant.querySelector('.idea-terminal');
          if (terminal.dataset.running === 'true') return;
          terminal.dataset.running = 'true';

          const lines = [
            \`> running \${idea.name}.py...\`,
            \`  initializing concept_engine...\`,
            \`  loading idea_tree.json...\`,
            \`  RuntimeError: idea not yet built. work in progress.\`
          ];

          terminal.innerHTML = '';
          terminal.classList.add('visible');

          let lineIdx = 0;
          function printNextLine() {
            if (lineIdx >= lines.length) {
              setTimeout(() => {
                terminal.classList.remove('visible');
                setTimeout(() => {
                  terminal.dataset.running = 'false';
                }, 400);
              }, 2200);
              return;
            }
            const row = document.createElement('div');
            const isError = lines[lineIdx].includes('RuntimeError');
            row.textContent = lines[lineIdx];
            if (isError) row.classList.add('term-error');
            terminal.appendChild(row);
            lineIdx++;
            setTimeout(printNextLine, lineIdx === 1 ? 0 : 320);
          }
          printNextLine();
        });

      } else {
        quadrant.classList.add('dimmed');
        quadrant.innerHTML = \`
          <div class="sig-line">
            <span class="kw">def </span>
            <span class="idea-name">???</span>
            <span class="colon">:</span>
          </div>
          <div class="desc-line">
            <span class="desc-kw">desc = </span>
            <span class="quote">"</span><span class="idea-desc">coming soon</span><span class="quote">"</span>
          </div>
        \`;
      }
      
      quadrant.addEventListener('click', () => {
        if (!idea) return;
        const panel = document.getElementById('idea-expanded-panel');
        const currentIdx = parseInt(panel.dataset.activeIndex ?? '-1');
        if (currentIdx === i) {
          collapseIdea();
        } else {
          expandIdea(i);
        }
      });

      grid.appendChild(quadrant);
    }
  }

  function expandIdea(index) {
    const idea = loadedIdeas[index];
    if (!idea) return;
    
    collapseIdea(false); 

    document.getElementById('expanded-def-line').innerHTML =
      \`<span style="color:var(--keyword);font-family:'JetBrains Mono';font-size:13px">def </span>\` +
      \`<span style="color:white;font-family:Inter;font-size:24px;font-weight:600">\${idea.name}</span>\` +
      \`<span style="color:#555;font-family:'JetBrains Mono';font-size:13px">:</span>\`;

    document.getElementById('expanded-long-desc').innerHTML =
      \`<div style="margin-top:20px;padding-left:24px;font-family:Inter;font-size:15px;\` +
      \`font-weight:300;color:#cccccc;line-height:1.85;max-width:620px">\${idea.longDesc}</div>\`;

    const gridRect = grid.getBoundingClientRect();
    const panelW = gridRect.width * 0.65;
    const panelH = gridRect.height * 0.70;
    const panelL = gridRect.left + (gridRect.width - panelW) / 2;
    
    const panel = document.getElementById('idea-expanded-panel');
    panel.style.width  = panelW + 'px';
    panel.style.minHeight = panelH + 'px';
    panel.style.left   = panelL + 'px';
    panel.style.position = 'fixed';
    panel.style.top    = (gridRect.top + (gridRect.height - panelH) / 2) + 'px';

    grid.classList.add('has-expanded');
    panel.dataset.activeIndex = index;
    requestAnimationFrame(() => panel.classList.add('visible'));
  }

  function collapseIdea(animate = true) {
    const panel = document.getElementById('idea-expanded-panel');
    if (!panel.classList.contains('visible')) return;
    panel.classList.remove('visible');
    grid.classList.remove('has-expanded');
    if (!animate) {
      panel.style.transition = 'none';
      requestAnimationFrame(() => { panel.style.transition = ''; });
    }
    panel.dataset.activeIndex = '-1';
  }

  const closeBtn = document.querySelector('.close-expanded');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      collapseIdea(); 
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') collapseIdea();
  });

  if (window.initGlitch) window.initGlitch();
  if (window.initFooter) window.initFooter();
});
