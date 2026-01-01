(function (window, document) {
  const loveSite = window.LoveSite || {};
  const utils = loveSite.utils;
  if (!utils) return;

  const START_DATE = "2025-06-16T00:00:00+09:00";

  function initConfetti() {
    if (typeof window.confetti !== "function") return;

    window.addEventListener("load", () => {
      window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      const end = Date.now() + 3000;
      (function frame() {
        window.confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        window.confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) window.requestAnimationFrame(frame);
      })();
    });
  }

  function updateAnniversaryText() {
    const text = document.getElementById("anniversary-text");
    if (!text) return;
    const diffDays = utils.daysSince(START_DATE);
    text.innerHTML = `It's our ${diffDays} day anniversary!ㅋㅋㅋㅋㅋㅋㅋ<small class="caption">I'M SORRY I'M SO LATE I KNOW THIS TOOK WAY TOO LONG</small>`;
  }

  function init() {
    if (!document.body.classList.contains("home-page")) return;
    initConfetti();
    updateAnniversaryText();
    utils.initLetterAccess(document);
  }

  init();
})(window, document);
