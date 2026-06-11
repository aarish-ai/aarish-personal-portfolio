(function () {
  const GLITCH_CHARS = '!@#$%^&*<>?/\\|[]{}~`';
  const CORRUPT_COUNT = 3;      // how many chars corrupt at once
  const INTERVAL_MIN = 7000;    // ms
  const INTERVAL_MAX = 11000;

  function getTextNodes(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          const tag = p.tagName.toLowerCase();
          if (['script','style','noscript'].includes(tag))
            return NodeFilter.FILTER_REJECT;
          if (p.closest('#ambient-footer'))
            return NodeFilter.FILTER_REJECT;
          if (p.closest('#contact-dialog'))
            return NodeFilter.FILTER_REJECT;
          if (node.textContent.trim().length < 2)
            return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  function glitchOnce() {
    const nodes = getTextNodes(document.body);
    if (nodes.length === 0) return;

    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const text = node.textContent;
    if (text.trim().length < 2) return;

    const eligibleIdx = [];
    for (let i = 0; i < text.length; i++) {
      if (/[a-zA-Z0-9]/.test(text[i])) eligibleIdx.push(i);
    }
    if (eligibleIdx.length < CORRUPT_COUNT) return;

    for (let i = eligibleIdx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [eligibleIdx[i], eligibleIdx[j]] = [eligibleIdx[j], eligibleIdx[i]];
    }
    const targets = eligibleIdx.slice(0, CORRUPT_COUNT);

    const parent = node.parentElement;
    const frag = document.createDocumentFragment();

    let last = 0;
    const sorted = [...targets].sort((a, b) => a - b);
    sorted.forEach(idx => {
      if (idx > last) {
        frag.appendChild(document.createTextNode(text.slice(last, idx)));
      }
      const s = document.createElement('span');
      s.className = 'glitch-char';
      s.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      frag.appendChild(s);
      last = idx + 1;
    });
    if (last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }

    const wrapper = document.createElement('span');
    wrapper.appendChild(frag);
    parent.replaceChild(wrapper, node);

    setTimeout(() => {
      parent.replaceChild(document.createTextNode(text), wrapper);
    }, 180);
  }

  function scheduleNext() {
    const delay = INTERVAL_MIN + Math.random() * (INTERVAL_MAX - INTERVAL_MIN);
    setTimeout(() => {
      glitchOnce();
      scheduleNext();
    }, delay);
  }

  window.initGlitch = function () {
    scheduleNext();
  };
})();
