(function (window, document) {
  "use strict";

  const LoveSite = window.LoveSite || {};

  /**
   * Normalize a string value for comparison
   * @param {*} value - The value to normalize
   * @returns {string} - Normalized string
   */
  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  /**
   * Convert a value to a number
   * @param {*} value - The value to convert
   * @returns {number} - Numeric value or NaN
   */
  function toNumber(value) {
    const numeric = Number(String(value || "").trim());
    return Number.isNaN(numeric) ? NaN : numeric;
  }

  /**
   * Calculate days since a given date
   * @param {string} dateStr - ISO 8601 date string
   * @returns {number} - Number of days
   */
  function daysSince(dateStr) {
    try {
      const start = new Date(dateStr);
      if (isNaN(start.getTime())) {
        console.warn("Invalid date string:", dateStr);
        return 0;
      }
      const now = new Date();
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffTime = todayMidnight - start;
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch (err) {
      console.error("Error calculating days:", err);
      return 0;
    }
  }

  /**
   * Initialize letter access unlock system
   * @param {Document|Element} root - Root element to search within
   */
  function initLetterAccess(root = document) {
    const boxes = root.querySelectorAll(".letter-access");
    
    boxes.forEach((box) => {
      try {
        const correctCode = (box.dataset.code || "").toLowerCase();
        const targetPage = box.dataset.target || "#";
        const button = box.querySelector(".unlockBtn");
        const input = box.querySelector(".accessCode");
        const message = box.querySelector(".unlockMsg");

        // Validate required elements
        if (!button || !input || !message || !correctCode || targetPage === "#") {
          console.warn("Letter access box missing required elements");
          return;
        }

        /**
         * Handle unlock button click
         */
        function handleUnlock() {
          const code = (input.value || "").trim().toLowerCase();
          
          if (code === correctCode) {
            message.textContent = "Access granted!";
            message.style.color = "var(--color-success)";
            message.setAttribute("aria-live", "assertive");
            
            setTimeout(() => {
              try {
                window.location.href = targetPage;
              } catch (err) {
                console.error("Navigation error:", err);
                message.textContent = "Navigation error. Please try again.";
                message.style.color = "var(--color-error)";
              }
            }, 800);
          } else {
            message.textContent = "어라 망가졌나 다시 해봐";
            message.style.color = "var(--color-error)";
            input.value = "";
            input.focus();
          }
        }

        // Click handler
        button.addEventListener("click", handleUnlock);

        // Enter key handler
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleUnlock();
          }
        });
      } catch (err) {
        console.error("Error initializing letter access:", err);
      }
    });
  }

  // Export utilities
  LoveSite.utils = {
    normalize,
    toNumber,
    daysSince,
    initLetterAccess,
  };

  window.LoveSite = LoveSite;
})(window, document);

