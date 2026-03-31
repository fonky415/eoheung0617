(function (window, document) {
  "use strict";

  // Configuration
  const CORRECT_PASSWORD = "congrats";
  const REDIRECT_PAGE = "html/home.html";
  const REDIRECT_DELAY = 1000;

  // Get DOM elements with error handling
  const form = document.getElementById("loginForm");
  if (!form) {
    console.warn("Login form not found");
    return;
  }

  const input = document.getElementById("password");
  const message = document.getElementById("message");

  if (!input || !message) {
    console.warn("Login form elements not found");
    return;
  }

  /**
   * Handle form submission
   * @param {Event} event - The form submit event
   */
  function handleSubmit(event) {
    event.preventDefault();

    const value = (input.value || "").trim();

    // Validate input
    if (!value) {
      showError("Please enter a password");
      return;
    }

    // Check password
    if (value.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
      showSuccess("올ㄹㄹ 맞쳤네");
      setTimeout(() => {
        try {
          window.location.href = REDIRECT_PAGE;
        } catch (err) {
          console.error("Navigation error:", err);
          message.textContent = "Navigation error. Please try again.";
          message.style.color = "var(--color-error)";
        }
      }, REDIRECT_DELAY);
    } else {
      showError("hint: terraria password?");
      input.value = "";
      input.focus();
    }
  }

  /**
   * Display success message
   * @param {string} text - Message text
   */
  function showSuccess(text) {
    message.textContent = text;
    message.style.color = "var(--color-success)";
  }

  /**
   * Display error message
   * @param {string} text - Message text
   */
  function showError(text) {
    message.textContent = text;
    message.style.color = "var(--color-error)";
  }

  // Event listeners
  form.addEventListener("submit", handleSubmit);

  // Allow 'Enter' key in input to submit
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  });

  // Set focus to input on load
  window.addEventListener("load", () => {
    input.focus();
  });
})(window, document);

