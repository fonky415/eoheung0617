// Tiny starter JS
const $ = (sel) => document.querySelector(sel);

window.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  $("#btn").addEventListener("click", () => {
    $("#out").textContent = "It works. Replace this with your own logic.";
  });
});