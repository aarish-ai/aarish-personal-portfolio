(function () {
  const seal     = document.getElementById('contact-seal');
  const backdrop = document.getElementById('contact-backdrop');
  const panel    = document.getElementById('contact-panel');
  const closeBtn = document.getElementById('contact-panel-close');
  const content  = document.getElementById('contact-panel-content');

  function openPanel() {
    fetch('data/contact.json')
      .then(r => r.json())
      .then(c => {
        content.innerHTML = `
          <a href="mailto:${c.email}">${c.email}</a>
          <a href="https://${c.github}" target="_blank">${c.github}</a>
          <a href="https://${c.linkedin}" target="_blank">${c.linkedin}</a>
          <a href="CV.pdf" download="Aarish_CV.pdf">Download CV →</a>
        `;
        backdrop.classList.add('active');
        panel.classList.add('active');
      });

    // Also wire the footer links to the same data, if footer
    // elements exist on this page
    const emailEl    = document.getElementById('footer-email');
    const githubEl   = document.getElementById('footer-github');
    const linkedinEl = document.getElementById('footer-linkedin');
    if (emailEl) {
      fetch('data/contact.json').then(r => r.json()).then(c => {
        emailEl.href    = `mailto:${c.email}`;
        githubEl.href   = `https://${c.github}`;
        linkedinEl.href = `https://${c.linkedin}`;
      });
    }
  }

  function closePanel() {
    backdrop.classList.remove('active');
    panel.classList.remove('active');
  }

  if (seal) seal.addEventListener('click', openPanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (backdrop) backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePanel();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  // Wire footer links even without opening the panel, on page load
  window.addEventListener('DOMContentLoaded', () => {
    const emailEl = document.getElementById('footer-email');
    if (!emailEl) return;
    fetch('data/contact.json').then(r => r.json()).then(c => {
      emailEl.href = `mailto:${c.email}`;
      document.getElementById('footer-github').href   = `https://${c.github}`;
      document.getElementById('footer-linkedin').href = `https://${c.linkedin}`;
    });

    setTimeout(() => {
      document.getElementById('contact-seal')?.classList.add('seal-pulse');
    }, 1100);
  });
})();
