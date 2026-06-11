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

  const arrayContainer = document.getElementById('projects-array');
  const detailsPanel = document.getElementById('project-details');
  const projTitle = document.getElementById('proj-title');
  const projDesc = document.getElementById('proj-desc');
  const projStack = document.getElementById('proj-stack');
  const projLinkWrapper = document.getElementById('proj-link-wrapper');

  let currentProjects = [];
  let activeIndex = -1;
  let animationTimer1, animationTimer2, animationTimer3;

  fetch('data/projects.json')
    .then(r => r.json())
    .then(projects => {
      currentProjects = projects;
      renderProjectArray(projects);
      // Empty start state: do not select any project on load
    })
    .catch(err => console.error("Error loading projects:", err));

  function highlightDesc(description, highlights) {
    let result = description;
    if (!highlights) return result;
    highlights.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, `<span style="color:var(--teal);font-weight:500">${word}</span>`);
    });
    return result;
  }

  function renderProjectArray(projects) {
    arrayContainer.innerHTML = '';
    
    const decl = document.createElement('div');
    decl.className = 'projects-array-decl';
    decl.innerHTML = `projects = <span class="projects-array-bracket">[</span>`;
    arrayContainer.appendChild(decl);

    projects.forEach((proj, index) => {
      const item = document.createElement('span');
      item.className = 'project-item array-item';
      item.dataset.index = index;
      item.innerHTML = `"${proj.name}"<span class="project-item-comma">,</span>`;
      
      item.addEventListener('click', () => {
        selectProject(index);
      });
      
      arrayContainer.appendChild(item);
    });

    const closeBracket = document.createElement('div');
    closeBracket.className = 'projects-array-bracket';
    closeBracket.style.marginTop = '28px';
    closeBracket.textContent = ']';
    arrayContainer.appendChild(closeBracket);
  }

  function selectProject(index) {
    if (activeIndex === index) return;
    activeIndex = index;

    // Clear previous timers
    clearTimeout(animationTimer1);
    clearTimeout(animationTimer2);
    clearTimeout(animationTimer3);

    const items = document.querySelectorAll('.project-item');
    items.forEach((item, idx) => {
      // Remove any existing cursor
      const cursor = item.querySelector('.array-cursor');
      if (cursor) cursor.remove();

      if (idx === index) {
        item.classList.add('active');
        // Add cursor after the quote
        const comma = item.querySelector('.project-item-comma');
        item.insertBefore(document.createElement('span'), comma);
        item.lastElementChild.previousElementSibling.outerHTML = '<span class="array-cursor">▌</span>';
      } else {
        item.classList.remove('active');
      }
    });

    const project = currentProjects[index];

    // Reset panel content for import animation
    projTitle.textContent = '';
    projDesc.innerHTML = '';
    projStack.innerHTML = '';
    projLinkWrapper.innerHTML = '';
    detailsPanel.style.opacity = '1';

    // Show import animation
    const tempLine = document.createElement('div');
    tempLine.style.color = '#444444';
    tempLine.style.fontFamily = "'JetBrains Mono', monospace";
    tempLine.style.fontSize = '13px';
    tempLine.innerHTML = `> importing ${project.name}...`;
    projDesc.appendChild(tempLine);

    animationTimer1 = setTimeout(() => {
      tempLine.innerHTML = `> importing ${project.name}... <span style="color:var(--teal)">✓</span>`;
      
      animationTimer2 = setTimeout(() => {
        detailsPanel.style.opacity = '0';
        
        animationTimer3 = setTimeout(() => {
          // Fill actual details
          tempLine.remove();
          projTitle.textContent = project.name;
          projDesc.innerHTML = highlightDesc(project.description, project.highlights);
          
          projStack.innerHTML = '<span class="tech-label">stack  </span>' + 
            (project.tech || []).map(t => `<span class="tech-token">${t}</span>`).join('<span class="tech-sep">  ·  </span>');

          if (project.url) {
            projLinkWrapper.innerHTML = `<a href="${project.url}" target="_blank" rel="noopener" class="view-link">→ view project</a>`;
          } else {
            projLinkWrapper.innerHTML = '';
          }

          detailsPanel.style.opacity = '1';
        }, 200);
      }, 400);
    }, 200);
  }

  if (window.initGlitch) window.initGlitch();
  if (window.initFooter) window.initFooter();
});
