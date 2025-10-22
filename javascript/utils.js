(function (window, document) {
  const LoveSite = window.LoveSite || {};

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function toNumber(value) {
    const numeric = Number(String(value || "").trim());
    return Number.isNaN(numeric) ? NaN : numeric;
  }

  function daysSince(dateStr) {
    const start = new Date(dateStr);
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = todayMidnight - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function initLetterAccess(root = document) {
    const boxes = root.querySelectorAll(".letter-access");
    boxes.forEach((box) => {
      const correctCode = (box.dataset.code || "").toLowerCase();
      const targetPage = box.dataset.target || "#";
      const button = box.querySelector(".unlockBtn");
      const input = box.querySelector(".accessCode");
      const message = box.querySelector(".unlockMsg");

      if (!button || !input || !message || !correctCode || targetPage === "#") {
        return;
      }

      button.addEventListener("click", () => {
        const code = (input.value || "").trim().toLowerCase();
        if (code === correctCode) {
          message.textContent = "Access granted!";
          message.style.color = "green";
          setTimeout(() => {
            window.location.href = targetPage;
          }, 800);
        } else {
          message.textContent = "어라 망가졌나 다시 해봐";
          message.style.color = "crimson";
          input.value = "";
          input.focus();
        }
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          button.click();
        }
      });
    });
  }

  LoveSite.utils = {
    normalize,
    toNumber,
    daysSince,
    initLetterAccess,
  };

  window.LoveSite = LoveSite;
})(window, document);
