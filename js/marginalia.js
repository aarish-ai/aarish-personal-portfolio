(function () {
  // EDIT THESE — replace with whatever you want rotating through
  // the right margin. Keep each line short (it's a single line,
  // no wrapping). One line = it just sits there permanently.
  const LINES = [
    'edit me — line one',
    'edit me — line two',
    'edit me — line three'
  ];

  const el = document.getElementById('marginalia');
  if (!el || LINES.length === 0) return;

  let index = 0;

  function showLine() {
    el.classList.remove('visible');
    setTimeout(() => {
      el.textContent = LINES[index];
      el.classList.add('visible');
      index = (index + 1) % LINES.length;
    }, 400);
  }

  showLine();
  if (LINES.length > 1) {
    setInterval(showLine, 7000);
  }
})();
