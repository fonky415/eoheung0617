(function (window, document) {
  const LoveSite = window.LoveSite || {};
  const utils = LoveSite.utils;

  const form = document.getElementById("personalityForm");
  const resultEl = document.getElementById("result");
  const unlockSection = document.getElementById("unlockSection");

  if (!form || !resultEl || !unlockSection) return;

  const questionNames = Array.from({ length: 17 }, (_, index) => `q${index + 1}`);
  let letterAccessInitialized = false;

  function setResult(message, status) {
    resultEl.textContent = message;
    resultEl.classList.remove("muted", "error", "success");
    if (status === "error") {
      resultEl.classList.add("error");
    } else if (status === "success") {
      resultEl.classList.add("success");
    } else {
      resultEl.classList.add("muted");
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

    setResult('the code is "warm"', "success");
    unlockSection.hidden = false;

    if (!letterAccessInitialized && utils && typeof utils.initLetterAccess === "function") {
      utils.initLetterAccess(unlockSection);
      letterAccessInitialized = true;
    }
  });

  form.addEventListener("reset", () => {
    setResult("", "neutral");
    unlockSection.hidden = true;
    const accessInput = unlockSection.querySelector(".accessCode");
    const accessMessage = unlockSection.querySelector(".unlockMsg");
    if (accessInput) accessInput.value = "";
    if (accessMessage) {
      accessMessage.textContent = "";
      accessMessage.style.color = "";
    }
  });
})(window, document);
