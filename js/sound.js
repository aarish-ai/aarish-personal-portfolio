(function () {
  let ctx = null;
  let enabled = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function playKeyClick() {
    if (!enabled) return;
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(820, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.06);
  }

  function playOutputSound() {
    if (!enabled) return;
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, ac.currentTime + 0.07);
    gain.gain.setValueAtTime(0.07, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.09);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.1);
  }

  function toggle() {
    enabled = !enabled;
    const btn = document.getElementById('sound-toggle');
    if (btn) {
      btn.textContent = enabled ? '♪' : '♩';
      btn.classList.toggle('active', enabled);
    }
    if (enabled && ctx && ctx.state === 'suspended') ctx.resume();
  }

  window.SoundModule = { playKeyClick, playOutputSound, toggle };

  window.initSound = function () {
    const btn = document.createElement('button');
    btn.id = 'sound-toggle';
    btn.className = 'magnetic';
    btn.textContent = '♩';
    btn.title = 'Toggle keyboard sounds';
    btn.addEventListener('click', toggle);
    document.body.appendChild(btn);
  };
})();
