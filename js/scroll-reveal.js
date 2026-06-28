(function () {
  const work = document.getElementById('work');
  if (!work) return;

  if (!('IntersectionObserver' in window)) {
    if (typeof fillTessellationSequentially === 'function') {
      fillTessellationSequentially();
    }
    return;
  }

  let fired = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        if (typeof fillTessellationSequentially === 'function') {
          fillTessellationSequentially();
        }
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(work);
})();
