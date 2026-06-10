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

  fetch('data/ideas.json')
    .then(r => r.json())
    .then(ideas => {
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
      
      if (idea) {
        quadrant.innerHTML = `
          <div class="sig-line">
            <span class="kw">def </span>
            <span class="idea-name">${idea.name}</span>
            <span class="colon">:</span>
          </div>
          <div class="desc-line">
            <span class="desc-kw">desc = </span>
            <span class="quote">"</span><span class="idea-desc">${idea.description}</span><span class="quote">"</span>
          </div>
        `;
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
      
      grid.appendChild(quadrant);
    }
  }
});
