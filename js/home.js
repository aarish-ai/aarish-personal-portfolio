(function () {
  'use strict';

  // ── CONSTANTS ─────────────────────────────────────────
  const ALL_COMMANDS = [
    'yourWork', 'work',
    'aboutYou', 'about',
    'yourIdeas', 'ideas',
    'downloadCv', 'cv',
    '/help', '/clear',
    '/rumi', '/bismillah', '/sudo'
  ];

  // ── STATE ──────────────────────────────────────────────
  const cmdHistory = [];
  let historyPtr   = -1;
  let helpVisible  = false;

  // ── ELEMENT REFERENCES ────────────────────────────────
  const input      = document.getElementById('chat-input');
  const outputArea = document.getElementById('chat-output');
  const nameEl     = document.getElementById('aarish-name');
  const dialog     = document.getElementById('contact-dialog');

  if (!input) {
    console.error('[home.js] FATAL: chat input element not found.' +
      ' Check that home.html has an element with id="chat-input".' +
      ' If the id is different, update this file to match.');
    return;
  }
  if (!outputArea) {
    console.error('[home.js] FATAL: chat output element not found.' +
      ' Check that home.html has an element with id="chat-output".' +
      ' If the id is different, update this file to match.');
    return;
  }

  console.log('[home.js] Input and output elements found. Initializing.');

  // ── NAVIGATION HELPER ─────────────────────────────────
  function navigateTo(url) {
    document.body.style.transition = 'opacity 400ms ease';
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = url; }, 420);
  }

  // ── OUTPUT HELPERS ────────────────────────────────────
  function printLine(text, color, extraStyle) {
    const line = document.createElement('div');
    line.style.fontFamily = "'JetBrains Mono', monospace";
    line.style.fontSize   = '13px';
    line.style.lineHeight = '1.8';
    line.style.color      = color || '#cccccc';
    line.style.marginTop  = '4px';
    if (extraStyle) Object.assign(line.style, extraStyle);
    line.textContent = text;
    outputArea.appendChild(line);
    if (typeof SoundModule !== 'undefined') SoundModule.playOutputSound();
  }

  function printHTML(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    outputArea.appendChild(wrapper);
    if (typeof SoundModule !== 'undefined') SoundModule.playOutputSound();
  }

  function printBlank() {
    const spacer = document.createElement('div');
    spacer.style.height = '8px';
    outputArea.appendChild(spacer);
  }

  // ── COMMAND HANDLERS ──────────────────────────────────

  function cmdHelp() {
    const rows = [
      { left: 'Work',       right: 'yourWork'   },
      { left: 'About',      right: 'aboutYou'   },
      { left: 'Ideas',      right: 'yourIdeas'  },
      { left: 'CV',         right: 'downloadCv' },
      { left: '/help',      right: ''           },
      { left: '/clear',     right: ''           },
      { left: '/rumi',      right: ''           },
      { left: '/bismillah', right: ''           },
      { left: '/sudo',      right: ''           },
    ];

    printBlank();
    rows.forEach(row => {
      const line = document.createElement('div');
      line.style.fontFamily = "'JetBrains Mono', monospace";
      line.style.fontSize   = '13px';
      line.style.lineHeight = '2';
      line.style.display    = 'flex';
      line.style.gap        = '32px';

      const lCol = document.createElement('span');
      lCol.style.color     = '#38bdf8';
      lCol.style.minWidth  = '120px';
      lCol.textContent     = row.left;

      const rCol = document.createElement('span');
      rCol.style.color     = '#555555';
      rCol.textContent     = row.right;

      line.appendChild(lCol);
      line.appendChild(rCol);
      outputArea.appendChild(line);
    });
    printBlank();
    if (typeof SoundModule !== 'undefined') SoundModule.playOutputSound();
    helpVisible = true;
  }

  function cmdClear() {
    outputArea.innerHTML = '';
    helpVisible = false;
    if (typeof SoundModule !== 'undefined') SoundModule.playOutputSound();
  }

  function cmdRumi() {
    printBlank();
    const block = document.createElement('div');
    block.style.borderLeft   = '2px solid #2dd4bf';
    block.style.paddingLeft  = '16px';
    block.style.marginTop    = '4px';
    block.style.marginBottom = '4px';

    const quote = document.createElement('div');
    quote.style.fontFamily  = 'Inter, sans-serif';
    quote.style.fontSize    = '14px';
    quote.style.fontStyle   = 'italic';
    quote.style.color       = '#cccccc';
    quote.style.lineHeight  = '1.8';
    quote.textContent = '"Love rests on no foundation. ' +
      'It is an endless ocean, with no beginning or end."';

    const attr = document.createElement('div');
    attr.style.fontFamily  = "'JetBrains Mono', monospace";
    attr.style.fontSize    = '12px';
    attr.style.color       = '#2dd4bf';
    attr.style.marginTop   = '8px';
    attr.style.textAlign   = 'right';
    attr.textContent       = '— Rumi';

    block.appendChild(quote);
    block.appendChild(attr);
    outputArea.appendChild(block);
    printBlank();
    if (typeof SoundModule !== 'undefined') SoundModule.playOutputSound();
  }

  function cmdBismillah() {
    printLine('Starting with the Name of Allah . . .', '#2dd4bf');
  }

  function cmdSudo() {
    printLine('nice try.', '#555555');
  }

  function cmdContact() {
    fetch('data/contact.json')
      .then(r => r.json())
      .then(c => {
        printBlank();
        const fields = ['name', 'email', 'github', 'linkedin'];
        const lines  = [
          `<span style="color:#2dd4bf">contact</span>` +
          `<span style="color:#cccccc"> = {</span>`
        ];
        fields.forEach(key => {
          const pad = ' '.repeat(10 - key.length);
          lines.push(
            `<span style="color:#444">&nbsp;&nbsp;&nbsp;&nbsp;"</span>` +
            `<span style="color:#38bdf8">${key}</span>` +
            `<span style="color:#444">"${pad}"</span>` +
            `<span style="color:#2dd4bf">${c[key]}</span>` +
            `<span style="color:#444">",</span>`
          );
        });
        lines.push(`<span style="color:#cccccc">}</span>`);

        const block = document.createElement('div');
        block.style.fontFamily = "'JetBrains Mono', monospace";
        block.style.fontSize   = '13px';
        block.style.lineHeight = '1.9';
        block.style.marginTop  = '8px';
        block.innerHTML = lines.join('<br>');
        outputArea.appendChild(block);
        printBlank();
        if (typeof SoundModule !== 'undefined') SoundModule.playOutputSound();
      })
      .catch(() => {
        printLine('error: could not load contact.json', '#ff4444');
      });
  }

  function cmdDownloadCV() {
    const a = document.createElement('a');
    a.href     = 'CV.pdf';
    a.download = 'Aarish_CV.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    printLine('downloading Aarish_CV.pdf ...', '#2dd4bf');
  }

  function cmdNotFound(raw) {
    printLine(
      `command not found: ${raw}. type /help for options`,
      '#444444'
    );
  }

  // ── MAIN COMMAND ROUTER ───────────────────────────────
  function executeCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    // Log for debugging — remove after confirming it works
    console.log('[home.js] Executing command:', cmd);

    switch (cmd) {
      case 'yourwork':
      case 'work':
        navigateTo('work.html');
        break;
      case 'aboutyou':
      case 'about':
        navigateTo('about.html');
        break;
      case 'yourideas':
      case 'ideas':
        navigateTo('ideas.html');
        break;
      case 'downloadcv':
      case 'cv':
        cmdDownloadCV();
        break;
      case '/help':
        cmdHelp();
        break;
      case '/clear':
        cmdClear();
        break;
      case '/rumi':
        cmdRumi();
        break;
      case '/bismillah':
        cmdBismillah();
        break;
      case '/sudo':
        cmdSudo();
        break;
      default:
        cmdNotFound(raw.trim());
    }
  }

  // ── INPUT EVENT LISTENERS ─────────────────────────────
  input.addEventListener('keydown', function (e) {
    // --- ENTER: execute command ---
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;

      if (typeof SoundModule !== 'undefined') SoundModule.playKeyClick();

      // Save to history
      cmdHistory.unshift(val);
      if (cmdHistory.length > 50) cmdHistory.pop();
      historyPtr = -1;

      // Echo what the user typed
      printLine('> ' + val, '#555555');

      // Clear input
      input.value = '';

      // Execute
      executeCommand(val);
      return;
    }

    // --- TAB: autocomplete ---
    if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      const match = ALL_COMMANDS.find(c =>
        c.toLowerCase().startsWith(val)
      );
      if (match) {
        input.value = match;
        input.setSelectionRange(match.length, match.length);
      }
      return;
    }

    // --- ARROW UP: history previous ---
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyPtr < cmdHistory.length - 1) {
        historyPtr++;
        input.value = cmdHistory[historyPtr] || '';
        input.setSelectionRange(input.value.length, input.value.length);
      }
      return;
    }

    // --- ARROW DOWN: history next ---
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPtr > 0) {
        historyPtr--;
        input.value = cmdHistory[historyPtr] || '';
      } else {
        historyPtr   = -1;
        input.value  = '';
      }
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }

    // --- ANY OTHER KEY: click sound ---
    const ignored = ['Shift','Control','Alt','Meta','CapsLock',
                     'Backspace','Delete','Escape','ArrowLeft','ArrowRight'];
    if (!ignored.includes(e.key)) {
      if (typeof SoundModule !== 'undefined') SoundModule.playKeyClick();
    }
  });

  // ── CONTACT HOVER on #aarish-name ─────────────────────
  if (nameEl && dialog) {
    let hideTimer = null;

    nameEl.style.cursor = 'pointer';

    function showDialog() {
      clearTimeout(hideTimer);
      const rect  = nameEl.getBoundingClientRect();
      dialog.style.position = 'fixed';
      dialog.style.left = rect.left + 'px';
      dialog.style.top  = (rect.top - 46) + 'px';
      dialog.classList.add('visible');
    }

    function hideDialog() {
      hideTimer = setTimeout(() =>
        dialog.classList.remove('visible'), 200);
    }

    nameEl.addEventListener('mouseenter', showDialog);
    nameEl.addEventListener('mouseleave', hideDialog);
    dialog.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    dialog.addEventListener('mouseleave', hideDialog);

    dialog.addEventListener('click', () => {
      dialog.classList.remove('visible');
      cmdContact();
    });
  } else {
    if (!nameEl)  console.warn('[home.js] #aarish-name not found.');
    if (!dialog)  console.warn('[home.js] #contact-dialog not found.');
  }

  // ── INIT SHARED MODULES ───────────────────────────────
  if (typeof initGlitch  === 'function') initGlitch();
  else console.warn('[home.js] initGlitch not available.');

  if (typeof initFooter  === 'function') initFooter();
  else console.warn('[home.js] initFooter not available.');

  if (typeof initSound   === 'function') initSound();
  else console.warn('[home.js] initSound not available.');

  // Focus the input on load
  input.focus();
  console.log('[home.js] Ready.');

})();
