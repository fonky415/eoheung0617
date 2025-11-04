(function (window, document) {
  const form = document.getElementById("personalityForm");
  const resultEl = document.getElementById("result");

  if (!form || !resultEl) return;

  const questionNames = Array.from({ length: 17 }, (_, index) => `q${index + 1}`);
  const resultMessage = document.createElement("p");

  resultEl.appendChild(resultMessage);

  function handleBackClick() {
    window.history.back();
  }

  function clearBackButton() {
    const backButton = resultEl.querySelector(".backBtn");
    if (backButton) {
      backButton.removeEventListener("click", handleBackClick);
      backButton.remove();
    }
  }

  function addBackButton() {
    clearBackButton();
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "backBtn";
    backButton.textContent = "Back";
    backButton.addEventListener("click", handleBackClick);
    resultEl.appendChild(backButton);
  }

  function setResult(message, status, options = {}) {
    const { showBackButton = false } = options;

    resultMessage.textContent = message;
    resultEl.classList.remove("muted", "error", "success");

    if (status === "error") {
      resultEl.classList.add("error");
    } else if (status === "success") {
      resultEl.classList.add("success");
    } else {
      resultEl.classList.add("muted");
    }

    if (showBackButton) {
      addBackButton();
    } else {
      clearBackButton();
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const unanswered = questionNames.filter((name) => !data.get(name));

    if (unanswered.length > 0) {
      setResult("Please answer every question before finishing.", "error");
      return;
    }

    setResult('the code is "warm"', "success", { showBackButton: true });
  });

  form.addEventListener("reset", () => {
    setResult("", "neutral");
  });
})(window, document);
