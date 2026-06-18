document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.initIslamicBg === 'function') {
    window.initIslamicBg('islamic-bg-canvas');
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
      quadrant.className = 'quadrant magnetic';
      quadrant.dataset.ideaIndex = i;
      
      if (idea) {
        quadrant.innerHTML = `
          <button class="run-btn magnetic">run</button>
          <div class="sig-line">
            <span class="kw">def </span>
            <span class="idea-name"></span>
            <span class="colon">:</span>
          </div>
          <div class="desc-line">
            <span class="desc-kw">desc = </span>
            <span class="quote">"</span><span class="idea-desc">${idea.shortDesc}</span><span class="quote">"</span>
          </div>
          <div class="idea-terminal" data-running="false"></div>
        `;

        const nameSpan = quadrant.querySelector('.idea-name');
        if (typeof scrambleText === 'function') {
          scrambleText(nameSpan, idea.name, 1000);
        } else {
          nameSpan.textContent = idea.name;
        }

        const runBtn = quadrant.querySelector('.run-btn');
        runBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const terminal = quadrant.querySelector('.idea-terminal');
          if (terminal.dataset.running === 'true') return;
          terminal.dataset.running = 'true';

          const lines = [
            `> running ${idea.name}.py...`,
            `  initializing concept_engine...`,
            `  loading idea_tree.json...`,
            `  RuntimeError: idea not yet built. work in progress.`
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
        quadrant.innerHTML = `
          <div class="sig-line">
            <span class="kw">def </span>
            <span class="idea-name">???</span>
            <span class="colon">:</span>
          </div>
          <div class="desc-line">
            <span class="desc-kw">desc = </span>
            <span class="quote">"</span><span class="idea-desc">coming soon</span><span class="quote">"</span>
          </div>
        `;
      }
      
      quadrant.addEventListener('click', () => {
        if (!idea) return;
        if (activeIdx === i) {
          closeIdea();
        } else {
          openIdea(i);
        }
      });

      grid.appendChild(quadrant);
    }

    if (typeof initMagnetic === 'function') initMagnetic('.magnetic');
  }

  const backdrop    = document.getElementById('ideas-backdrop');
  const expandPanel = document.getElementById('idea-expanded-panel');
  const closeBtn    = document.getElementById('expanded-close-btn');
  let   activeIdx   = -1;

  function openIdea(index) {
    const idea = loadedIdeas[index];
    if (!idea) return;
    activeIdx = index;

    // Fill content — title and longDesc only, no keywords
    document.getElementById('expanded-idea-title').textContent = idea.name;
    document.getElementById('expanded-idea-desc').textContent  = idea.longDesc;

    // Activate backdrop then panel
    backdrop.classList.add('active');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        expandPanel.classList.add('visible');
      });
    });
  }

  function closeIdea() {
    activeIdx = -1;
    expandPanel.classList.remove('visible');
    backdrop.classList.remove('active');
  }

  // Close on backdrop click (outside the panel)
  // IMPORTANT: clicking the backdrop closes — clicking the panel does NOT
  backdrop.addEventListener('click', (e) => {
    // Only close if click is directly on backdrop, not on the panel
    if (e.target === backdrop) closeIdea();
  });

  // Close button inside panel
  closeBtn.addEventListener('click', closeIdea);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeIdx !== -1) closeIdea();
  });

  if (window.initGlitch) window.initGlitch();
  if (window.initFooter) window.initFooter();
  if (typeof initCustomCursor === 'function') initCustomCursor();
});
