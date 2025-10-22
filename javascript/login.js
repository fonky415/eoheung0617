(function (window, document) {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const CORRECT_PASSWORD = "congrats";
  const REDIRECT_PAGE = "html/home.html";

  const input = document.getElementById("password");
  const message = document.getElementById("message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = (input.value || "").trim();

    if (value.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
      message.textContent = "올ㄹㄹ 맞쳤네";
      message.style.color = "green";
      setTimeout(() => {
        window.location.href = REDIRECT_PAGE;
      }, 1000);
    } else {
      message.textContent = "hint: terraria password?";
      message.style.color = "crimson";
      input.value = "";
      input.focus();
    }
  });
})(window, document);
