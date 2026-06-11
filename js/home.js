document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");
  const outputArea = document.getElementById("chat-output");
  const ghostMsg = document.getElementById("ghost-msg");
  
  const cmdHistory = [];
  let historyPtr = -1;

  const ALL_COMMANDS = [
    'yourWork', 'work', 'aboutYou', 'about', 'yourIdeas', 'ideas',
    'downloadCv', 'cv', '/help', '/clear', '/rumi', '/bismillah', '/sudo', '/stack'
  ];

  let ghostTimeout;

  function showGhost(text) {
    ghostMsg.textContent = text;
    ghostMsg.classList.add("show");
    clearTimeout(ghostTimeout);
    ghostTimeout = setTimeout(() => {
      ghostMsg.classList.remove("show");
    }, 2000);
  }

  function navigate(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 400ms ease';
    setTimeout(() => {
      window.location.href = url;
    }, 420);
  }

  function printOutput(htmlContent) {
    const block = document.createElement("div");
    block.style.fontFamily = "'JetBrains Mono', monospace";
    block.style.fontSize = "13px";
    block.style.marginTop = "12px";
    block.innerHTML = htmlContent;
    outputArea.appendChild(block);
    if(window.SoundModule) window.SoundModule.playOutputSound();
  }

  input.addEventListener("keydown", (e) => {
    // Exclude modifiers and control keys
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if(window.SoundModule) window.SoundModule.playKeyClick();
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (!val) return;
      const match = ALL_COMMANDS.find(c => c.toLowerCase().startsWith(val));
      if (match) {
        input.value = match;
        input.setSelectionRange(match.length, match.length);
      }
    }

    if (e.key === "ArrowUp") {
      if (historyPtr < cmdHistory.length - 1) historyPtr++;
      input.value = cmdHistory[historyPtr] || '';
      input.setSelectionRange(input.value.length, input.value.length);
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      if (historyPtr > 0) historyPtr--;
      else { historyPtr = -1; input.value = ''; return; }
      input.value = cmdHistory[historyPtr] || '';
      e.preventDefault();
    }

    if (e.key === "Enter") {
      if(window.SoundModule) window.SoundModule.playKeyClick();
      const val = input.value.trim().toLowerCase();
      if (!val) return;

      cmdHistory.unshift(input.value);
      historyPtr = -1;
      if (cmdHistory.length > 50) cmdHistory.pop();

      if (val === "yourwork" || val === "work") {
        navigate("work.html");
      } else if (val === "aboutyou" || val === "about") {
        navigate("about.html");
      } else if (val === "yourideas" || val === "ideas") {
        navigate("ideas.html");
      } else if (val === "downloadcv" || val === "cv") {
        const a = document.createElement("a");
        a.href = "CV.pdf";
        a.download = "Aarish_CV.pdf";
        a.click();
        printOutput(`<span style="color:var(--teal)">downloading Aarish_CV.pdf ...</span>`);
        input.value = "";
      } else if (val === "/help") {
        printOutput(`
<pre style="line-height:1.8; margin:0;">
<span style="display:inline-block; width:130px; color:var(--keyword)">Work</span><span style="color:#666666">yourWork</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">About</span><span style="color:#666666">aboutYou</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">Ideas</span><span style="color:#666666">yourIdeas</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">CV</span><span style="color:#666666">downloadCv</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">/stack</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">/help</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">/clear</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">/rumi</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">/bismillah</span>
<span style="display:inline-block; width:130px; color:var(--keyword)">/sudo</span>
</pre>`);
        input.value = "";
      } else if (val === "/clear") {
        outputArea.innerHTML = "";
        input.value = "";
        if(window.SoundModule) window.SoundModule.playOutputSound();
      } else if (val === "/rumi") {
        printOutput(`
<br>
<div style="padding-left:16px; border-left:2px solid var(--teal);">
  <span style="color:#cccccc; font-family:'Inter',sans-serif; font-size:14px; line-height:1.8; font-style:italic;">
    "Love rests on no foundation.<br>It is an endless ocean, with no beginning or end."
  </span>
  <div style="color:var(--teal); text-align:right; margin-top:8px; font-size:12px;">— Rumi</div>
</div>
<br>`);
        input.value = "";
      } else if (val === "/bismillah") {
        printOutput(`<span style="color:var(--teal)">Starting with the Name of Allah . . .</span>`);
        input.value = "";
      } else if (val === "/sudo") {
        printOutput(`<span style="color:#555555">nice try.</span>`);
        input.value = "";
      } else {
        printOutput(`<span style="color:#444444">command not found: ${input.value}. type /help for options</span>`);
        input.value = "";
      }
    }
  });

  const nameEl = document.getElementById('aarish-name');
  const dialog = document.getElementById('contact-dialog');
  let dialogHideTimer = null;

  if (nameEl && dialog) {
    nameEl.style.cursor = 'pointer';
    nameEl.style.position = 'relative';

    function showDialog() {
      clearTimeout(dialogHideTimer);
      const rect = nameEl.getBoundingClientRect();
      dialog.style.left = rect.left + 'px';
      dialog.style.top  = (rect.top - 42 + window.scrollY) + 'px';
      dialog.classList.add('visible');
    }

    function hideDialog() {
      dialogHideTimer = setTimeout(() => {
        dialog.classList.remove('visible');
      }, 200);
    }

    nameEl.addEventListener('mouseenter', showDialog);
    nameEl.addEventListener('mouseleave', hideDialog);
    dialog.addEventListener('mouseenter', () => clearTimeout(dialogHideTimer));
    dialog.addEventListener('mouseleave', hideDialog);

    dialog.addEventListener('click', () => {
      dialog.classList.remove('visible');
      fetch('data/contact.json')
        .then(r => r.json())
        .then(contact => {
          const lines = [
            { text: 'contact',   color: 'var(--teal)' },
            { text: ' = {',      color: '#cccccc' },
          ];
          const fields = ['name','email','github','linkedin'];
          const maxLen = Math.max(...fields.map(f => f.length));
          fields.forEach(key => {
            const padding = ' '.repeat(maxLen - key.length + 4);
            lines.push({
              indent: true,
              key, padding,
              value: contact[key]
            });
          });
          lines.push({ text: '}', color: '#cccccc' });

          renderContactOutput(lines);
          if(window.SoundModule) window.SoundModule.playOutputSound();
        });
    });
  }

  function renderContactOutput(lines) {
    const block = document.createElement('div');
    block.style.fontFamily = "'JetBrains Mono', monospace";
    block.style.fontSize   = '13px';
    block.style.lineHeight = '1.9';
    block.style.marginTop  = '12px';

    lines.forEach(line => {
      const row = document.createElement('div');
      if (line.indent) {
        row.innerHTML =
          \`<span style="color:#444">    "</span>\` +
          \`<span style="color:var(--keyword)">\${line.key}</span>\` +
          \`<span style="color:#444">"\${line.padding}</span>\` +
          \`<span style="color:#444">"</span>\` +
          \`<span style="color:var(--teal)">\${line.value}</span>\` +
          \`<span style="color:#444">",</span>\`;
      } else {
        row.innerHTML = \`<span style="color:\${line.color}">\${line.text}</span>\`;
      }
      block.appendChild(row);
    });

    if (outputArea) outputArea.appendChild(block);
  }

  if(window.initGlitch) window.initGlitch();
  if(window.initFooter) window.initFooter();
  if(window.initSound) window.initSound();
});
