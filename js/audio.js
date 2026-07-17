(function() {
  const audio = document.getElementById('bg-audio');
  const btn = document.getElementById('audio-toggle');
  const iconOn = document.getElementById('audio-icon-on');
  const iconOff = document.getElementById('audio-icon-off');
  if (!audio || !btn) return;

  // Set volume low — ambient, not dominant
  audio.volume = 0.18;

  let isPlaying = false;

  function setPlaying(val) {
    isPlaying = val;
    if (iconOn && iconOff) {
      iconOn.style.display = val ? 'block' : 'none';
      iconOff.style.display = val ? 'none' : 'block';
    }
  }

  // Autoplay on first user interaction (browser policy requires gesture)
  function tryAutoplay() {
    audio.play().then(() => {
      setPlaying(true);
    }).catch(() => {
      // Autoplay blocked — wait for first click anywhere
      setPlaying(false);
      const onFirstClick = () => {
        audio.play().then(() => setPlaying(true)).catch(() => {});
        document.removeEventListener('click', onFirstClick);
      };
      document.addEventListener('click', onFirstClick);
    });
  }

  // Fade audio in gently
  function fadeIn() {
    audio.volume = 0;
    audio.play().then(() => {
      setPlaying(true);
      const target = 0.18;
      const step = target / 40;
      const interval = setInterval(() => {
        if (audio.volume < target - step) {
          audio.volume = Math.min(target, audio.volume + step);
        } else {
          audio.volume = target;
          clearInterval(interval);
        }
      }, 80); // fade in over ~3.2 seconds
    }).catch(() => { setPlaying(false); });
  }

  // Fade out and pause
  function fadeOut() {
    const startVol = audio.volume;
    const step = startVol / 20;
    const interval = setInterval(() => {
      if (audio.volume > step) {
        audio.volume = Math.max(0, audio.volume - step);
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(interval);
      }
    }, 50); // fade out over ~1s
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      fadeOut();
      setPlaying(false);
    } else {
      fadeIn();
    }
  });

  // Attempt autoplay after a short delay
  setTimeout(tryAutoplay, 800);
})();
