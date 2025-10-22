/* =========================================================
   Romantic Interactive “Human Test” for Jinny
   - One sentence at a time
   - Exact typing required to advance
   - Random encouraging feedback after each success
   - Final access code revealed after completion
   ========================================================= */

// ----------- Data -----------
const SENTENCES_RAW = [
  "I am not a robot.",
  "I am Jinny Lee.",
  "It’s been a long day, but I will muster up the energy and time to read one little thing.",
  "I am one of the smartest and nicest person to lay foot on this Earth.",
  "God will take care of hard decisions and everything will be fine.",
  "I don’t need to worry or overthink or contemplate about anything now, and things will solve itself later.",
  "I’m loved by so many people, including the author of this human test.",
  "If anything concerns me or I want to talk to anyone, I will text or call Phillip whenever I want because his time is my time.",
  "I will *crush* my midterms and finals and anything in my way.",
  "I look rather pretty today.",
  "I will look even better tomorrow.",
  "I’m thinking about eating that sugar bomb in the corner of my eye, but I understand that eating that will give me hyperglycemia and make me extremely hyper and hence will restrain myself from eating it.",
  "I feel like this is getting a bit too long and want to just read the letter.",
  "I love you too!"
];

// Friendly praise lines
const PRAISE = [
  "nice job!",
  "exactly!",
  "congrats!",
  "mmmm I agree",
  "ofc ofc",
  "ikr??",
  "frrr",
  "facts",
  "ㅇㅈㅇㅈ",
  "그치?"
];

// ----------- Elements -----------
const intro = document.getElementById("intro");
const continueLink = document.getElementById("continueLink");
const app = document.getElementById("app");
const promptEl = document.getElementById("prompt");
const form = document.getElementById("answerForm");
const input = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");

// ----------- Utilities -----------

/**
 * Convert lightweight *markdown* / **markdown** in a sentence to HTML.
 * Only handles italics and bold, per requirement.
 */
function renderMarkdownEmphasis(text) {
  // First bold **...**
  let html = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Then italic *...*
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return html;
}

/**
 * Normalize a sentence for comparison:
 * - Trim spaces
 * - Collapse multiple spaces to one
 * - Treat straight and curly quotes as equivalent
 * - Remove the literal asterisks used only for styling in display
 */
function normalizeForCompare(text) {
  return text
    .replace(/\*/g, "")                       // ignore asterisks used for emphasis in the prompt
    .replace(/[\u2018\u2019]/g, "'")          // curly single quotes → straight
    .replace(/[\u201C\u201D]/g, '"')          // curly double quotes → straight
    .replace(/\s+/g, " ")                     // collapse whitespace
    .trim();
}

/**
 * Show prompt with a fresh fade animation.
 */
function showPrompt(html) {
  promptEl.innerHTML = html;
  // Restart the fade animation
  promptEl.style.animation = "none";
  // Force reflow
  // eslint-disable-next-line no-unused-expressions
  promptEl.offsetHeight;
  promptEl.style.animation = "";
  promptEl.classList.remove("final");
}

/**
 * Show quick feedback line (italic), then fade.
 */
function showFeedback(line) {
  feedbackEl.textContent = line;
  feedbackEl.classList.add("show");
  setTimeout(() => feedbackEl.classList.remove("show"), 900);
}

/**
 * Random item from array
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ----------- App State -----------
let index = 0;

// ----------- Flow Control -----------

/** Initialize first sentence */
function startMission() {
  app.hidden = false;
  intro.classList.add("fade-out");
  intro.addEventListener("animationend", () => {
    intro.remove();
  }, { once: true });

  const html = renderMarkdownEmphasis(SENTENCES_RAW[index]);
  showPrompt(html);
  progressEl.textContent = `Sentence ${index + 1} of ${SENTENCES_RAW.length}`;
  input.value = "";
  input.focus();
}

/** Move to next or finish */
function advance() {
  index += 1;

  if (index >= SENTENCES_RAW.length) {
  // Final message with link to home
  const finalHTML = `
    You are not a robot! Your access code is: <strong>honest</strong>
    <br><br>
    <a href="home.html" class="continue"><em>continue to home →</em></a>
  `;
  promptEl.classList.add("final");
  showPrompt(finalHTML);
  form.remove(); // Remove input to keep page minimal at the end
  feedbackEl.remove();
  progressEl.textContent = "Complete";
  return;
}

  const nextHTML = renderMarkdownEmphasis(SENTENCES_RAW[index]);
  showPrompt(nextHTML);
  progressEl.textContent = `Sentence ${index + 1} of ${SENTENCES_RAW.length}`;
  input.value = "";
  input.focus();
}

// ----------- Event Listeners -----------

// Intro → Continue
continueLink?.addEventListener("click", (e) => {
  e.preventDefault();
  startMission();
});

// Check answers on submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = normalizeForCompare(input.value);
  const target = normalizeForCompare(SENTENCES_RAW[index]);

  if (user.length === 0) return;

  if (user === target) {
    showFeedback(pick(PRAISE));
    setTimeout(advance, 250);
  } else {
    // Gentle nudge; keep the surface minimal
    showFeedback("umm you typed something wrong (or this website is broken ㅎ)");
    // Keep input so she can fix small mistakes
    input.focus();
  }
});

// Allow Enter to submit (default form submit), but also guard against IME issues
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    // Let form submit handler run
  }
});

// ----------- Small polish -----------

// Fade-out animation for intro (CSS injected here to keep CSS file clean)
const style = document.createElement("style");
style.textContent = `
  .fade-out { animation: fadeOut 280ms ease forwards; }
  @keyframes fadeOut { to { opacity: 0; transform: translateY(-4px); } }
`;
document.head.appendChild(style);
