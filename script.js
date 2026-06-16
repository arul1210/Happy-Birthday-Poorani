(function () {
  'use strict';

  // ---- Target unlock moment: Updated to June 16, 2026, 08:00 PM IST ----
  var TARGET_TIME = new Date('2026-06-16T20:00:00+05:30').getTime();
  var unlocked = false;

  var els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
    status: document.getElementById('build-status'),
    celebrateBtn: document.getElementById('celebrate-btn'),
    lockedModal: document.getElementById('locked-modal'),
    lockedClose: document.getElementById('locked-close'),
    lockedCountdown: document.getElementById('locked-countdown'),
    overlay: document.getElementById('celebration-overlay'),
    overlayClose: document.getElementById('overlay-close'),
    audio: document.getElementById('bday-song'),
    confettiContainer: document.getElementById('confetti-container')
  };

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function setCountdownText(d, h, m, s) {
    if (els.days) els.days.textContent = pad(d);
    if (els.hours) els.hours.textContent = pad(h);
    if (els.mins) els.mins.textContent = pad(m);
    if (els.secs) els.secs.textContent = pad(s);
    if (els.lockedCountdown) {
      els.lockedCountdown.textContent = d + 'd ' + pad(h) + 'h ' + pad(m) + 'm ' + pad(s) + 's';
    }
  }

  function tick() {
    var now = Date.now();
    var diff = TARGET_TIME - now;

    if (diff <= 0) {
      if (!unlocked) {
        unlocked = true;
        document.body.classList.add('is-unlocked');
        if (els.status) els.status.textContent = '✓ Build succeeded — celebration deployed';
      }
      setCountdownText(0, 0, 0, 0);
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);
    setCountdownText(days, hours, mins, secs);
  }

  tick();
  setInterval(tick, 1000);

  // ---- Locked modal ----
  function openLockedModal() {
    if (!els.lockedModal) return;
    els.lockedModal.hidden = false;
    requestAnimationFrame(function () {
      els.lockedModal.classList.add('is-visible');
    });
  }

  function closeLockedModal() {
    if (!els.lockedModal) return;
    els.lockedModal.classList.remove('is-visible');
    setTimeout(function () {
      els.lockedModal.hidden = true;
    }, 200);
  }

  // ---- Confetti ----
  function launchConfetti() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !els.confettiContainer) return;

    var colors = ['#E8A23D', '#E3B7C0', '#C75D3B', '#F6EEE2', '#3E7A73'];

    for (var i = 0; i < 70; i++) {
      var piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.6 + 's';
      piece.style.animationDuration = 2.5 + Math.random() * 1.5 + 's';
      els.confettiContainer.appendChild(piece);
    }

    setTimeout(function () {
      els.confettiContainer.innerHTML = '';
    }, 4500);
  }

  // ---- Celebration overlay ----
  function openCelebration() {
    if (!els.overlay) return;
    els.overlay.hidden = false;
    requestAnimationFrame(function () {
      els.overlay.classList.add('is-visible');
    });
    launchConfetti();

    if (els.audio) {
      els.audio.currentTime = 0;
      els.audio.play().catch(function () {
        // Fail silently if autoplay is blocked
      });
    }
  }

  function closeCelebration() {
    if (!els.overlay) return;
    els.overlay.classList.remove('is-visible');
    if (els.audio) els.audio.pause();
    setTimeout(function () {
      els.overlay.hidden = true;
    }, 300);
  }

  if (els.celebrateBtn) {
    els.celebrateBtn.addEventListener('click', function () {
      if (unlocked) {
        openCelebration();
      } else {
        openLockedModal();
      }
    });
  }

  if (els.lockedClose) els.lockedClose.addEventListener('click', closeLockedModal);
  if (els.overlayClose) els.overlayClose.addEventListener('click', closeCelebration);

  // ---- Emoji Card Interactive Toggle ----
  var cards = document.querySelectorAll('.quote-card, .joke-card');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var revealed = card.classList.toggle('is-revealed');
      card.setAttribute('aria-expanded', revealed ? 'true' : 'false');
    });
    
    // Accessibility fallback for keyboard navigation
    card.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();
