(function () {
  'use strict';

  let enterAllowed  = false;
  let sequenceStarted = false;

  const ghostHint   = document.getElementById('ghost-hint');
  const bootSeq     = document.getElementById('boot-sequence');
  const promptCursor = document.getElementById('prompt-cursor');

  // Show ghost hint after short delay
  setTimeout(() => {
    ghostHint.classList.add('visible');
    enterAllowed = true;
  }, 400);

  // ── DELAYED LOADING PATTERN ──────────────────────
  // Each step: prints label, then appends ". . . Done"
  // with per-dot interval, then resolves a promise.
  //
  // interval: ms between each dot and before "Done"
  // Returns a Promise that resolves when "Done" appears.

  function bootLine(label, interval) {
    return new Promise(resolve => {
      const line = document.createElement('div');
      line.className = 'boot-line';
      line.textContent = label + ' ';
      bootSeq.appendChild(line);

      // Fade the line in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => line.classList.add('visible'));
      });

      let step = 0;
      const steps = ['.', ' .', ' .', ' Done'];
      // steps[0..2] are the three dots, steps[3] is Done

      function nextStep() {
        if (step >= steps.length) {
          resolve();
          return;
        }
        const chunk = steps[step];
        step++;

        if (chunk === ' Done') {
          const doneSpan = document.createElement('span');
          doneSpan.className = 'boot-done';
          doneSpan.textContent = ' Done';
          line.appendChild(doneSpan);
          setTimeout(resolve, interval);
        } else {
          line.appendChild(document.createTextNode(chunk));
          setTimeout(nextStep, interval);
        }
      }

      setTimeout(nextStep, interval);
    });
  }

  // ── ENTER LINE (no loading dots, just text) ───────
  function bootSimpleLine(text, delayBefore) {
    return new Promise(resolve => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.textContent = text;
        bootSeq.appendChild(line);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => line.classList.add('visible'));
        });
        setTimeout(resolve, 80);
      }, delayBefore);
    });
  }

  // ── BOOT SEQUENCE ─────────────────────────────────
  async function runBootSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    // Hide ghost hint and cursor
    ghostHint.style.opacity = '0';
    promptCursor.style.display = 'none';

    // Line 1: Installing dependencies  (0.7s per dot)
    await bootLine('Installing dependencies', 700);

    // Line 2: Installing Fable 5  (0.25s per dot)
    await bootLine('Installing Fable 5', 250);

    // Line 3: Dividing by zero  (0.5s per dot)
    await bootLine('Dividing by zero', 500);

    // Gap before the enter line
    await new Promise(r => setTimeout(r, 300));

    // Entering line (no dots)
    await bootSimpleLine(
      'Entering  (thank you for waiting)',
      0
    );

    // Init glitch + footer now that sequence is done
    if (typeof initGlitch  === 'function') initGlitch();
    if (typeof initFooter  === 'function') initFooter();

    // Navigate after 2.5 seconds
    setTimeout(() => {
      document.body.style.transition = 'opacity 400ms ease';
      document.body.style.opacity    = '0';
      setTimeout(() => { window.location.href = 'home.html'; }, 420);
    }, 2500);
  }

  // ── ENTER KEY LISTENER ────────────────────────────
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Enter' && enterAllowed && !sequenceStarted) {
      document.removeEventListener('keydown', handler);
      runBootSequence();
    }
  });

  if (typeof initCustomCursor === 'function') initCustomCursor();

})();
