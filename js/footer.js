(function () {
  const UPTIME     = '1 week';
  const LAST_COMMIT = '1d ago';

  const FAKE_COMMANDS = [
    'Using AI to learn AI to make AI',
    'Reading Documentation . . .',
    'Why did I declare this variable again?',
    'My code runs fine, mostly.',
    'Its not my code, the API is giving errors.',
    'Just call an API . . .',
    'LOVE :)',
    'Wait a minute! Your actually reading this stuff?'
  ];

  const TYPE_SPEED   = 55;    // ms per character
  const DELETE_SPEED = 28;    // ms per character (delete faster)
  const PAUSE_AFTER  = 2800;  // ms to hold before deleting
  const PAUSE_BEFORE = 600;   // ms pause before typing next

  window.initFooter = function () {
    const footer = document.createElement('div');
    footer.id = 'ambient-footer';
    footer.innerHTML = `
      <span class="footer-prompt">aarish@portfolio:~$</span>
      <span class="footer-cmd" id="footer-cmd-text"></span>
      <span class="footer-cursor">█</span>
      <span class="footer-right">
        uptime<span class="sep">·</span><span class="val">${UPTIME}</span>
        <span class="sep">|</span>
        last_commit<span class="sep">·</span><span class="val">${LAST_COMMIT}</span>
      </span>
    `;
    document.body.appendChild(footer);

    const cmdEl = document.getElementById('footer-cmd-text');
    let cmdIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = FAKE_COMMANDS[cmdIndex];

      if (!deleting) {
        charIndex++;
        cmdEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, PAUSE_AFTER);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        cmdEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          cmdIndex = (cmdIndex + 1) % FAKE_COMMANDS.length;
          setTimeout(tick, PAUSE_BEFORE);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    setTimeout(tick, 1200); 
  };
})();
