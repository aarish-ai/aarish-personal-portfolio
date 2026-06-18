(function () {
  const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$_';

  window.scrambleText = function (el, finalText, duration) {
    duration = duration || 500;
    const frameTime = 35; // ms per frame
    const totalFrames = Math.round(duration / frameTime);
    let frame = 0;

    const chars = finalText.split('');
    const lockFrame = chars.map((_, i) =>
      Math.floor((i / chars.length) * totalFrames * 0.7) +
      Math.floor(totalFrames * 0.3)
    );

    function tick() {
      let output = '';
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === ' ') { output += ' '; continue; }
        if (frame >= lockFrame[i]) {
          output += chars[i];
        } else {
          output += POOL[Math.floor(Math.random() * POOL.length)];
        }
      }
      el.textContent = output;
      frame++;

      if (frame <= totalFrames) {
        setTimeout(tick, frameTime);
      } else {
        el.textContent = finalText; // guarantee exact final text
      }
    }
    tick();
  };
})();
