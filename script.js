// --- config ---
const CORRECT_PASSWORD = "congrats";
const REDIRECT_PAGE = "home.html";

// --- password page logic (only if the form exists) ---
const form = document.getElementById("loginForm");
if (form) {
  const input = document.getElementById("password");
  const msg = document.getElementById("message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInput = input.value.trim();

    if (userInput.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
      msg.textContent = "올ㄹㄹ 맞쳤네";
      msg.style.color = "green";
      setTimeout(() => { window.location.href = REDIRECT_PAGE; }, 1000);
    } else {
      msg.textContent = "hint: terraria password?";
      msg.style.color = "crimson";
      input.value = "";
      input.focus();
    }
  });
}

// --- confetti on home page only ---
const onHome =
  document.body.classList.contains("home-page") ||
  /home\.html?$/.test(location.pathname);

if (onHome) {
  window.addEventListener("load", () => {
    if (typeof confetti !== "function") return; // safety if CDN missing

    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

    const end = Date.now() + 3000;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  });
}

// ---- Anniversary day counter ----
(function () {
  const startDate = new Date("2025-06-17T00:00:00"); // your start date
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diffTime = todayMidnight - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const text = document.getElementById("anniversary-text");
  if (text) {
    text.innerHTML = `It's our ${diffDays} day anniversary!ㅋㅋㅋㅋㅋㅋㅋ<small style="font-size:0.3em; color:#888; margin-left:0.5em;">I'M SORRY I'M SO LATE I KNOW THIS TOOK WAY TOO LONG</small>`;
  }
})();

// ---- letter unlock page logic ----
const CORRECT_CODE = "prudent"; // change to your actual code
const LETTER_PAGE = "letter1.html"; // the real letter page

const unlockBtn = document.getElementById("unlockBtn");
const accessCodeInput = document.getElementById("accessCode");
const unlockMsg = document.getElementById("unlockMsg");

if (unlockBtn) {
  unlockBtn.addEventListener("click", () => {
    const code = accessCodeInput.value.trim();
    if (code.toLowerCase() === CORRECT_CODE.toLowerCase()) {
      unlockMsg.textContent = "Access granted!";
      unlockMsg.style.color = "green";
      setTimeout(() => {
        window.location.href = LETTER_PAGE;
      }, 800);
    } else {
      unlockMsg.textContent = "Wrong code. Try again!";
      unlockMsg.style.color = "crimson";
      accessCodeInput.value = "";
      accessCodeInput.focus();
    }
  });
}

// ------- Trivia Config -------
const ACCESS_CODE = "prudent";
const CORRECT = {
  q1: 6,                     // allergies
  q2: 170,                   // height cm
  q3: ["brown","sepia","beige","tan","camel","sand","khaki"],
  q4: 3,                     // cousins
  q5: ["iphone 12","12","apple iphone 12","iphone12","iphone-12"],
  q6: [
    "rach","rachmaninoff","rachmaninov","rachmaninoff","rachmaninof",
    "sergei rachmaninoff","sergey rachmaninoff","sergei rachmaninov",
    "sergey rachmaninov","sergei vasilievich rachmaninoff","sergey vasilievich rachmaninoff",
    "sergei","sergey" // we'll require 'rach' present if only sergei/sergey? handle below
  ],
  q7: ["peach"],
  q8: "16:00",               // 4 PM
  q9: ["pantheon"],
  q10: ["Top","Jungle"],     // must be exactly these two
  q11: "False",
  q12: "index",              // selected finger
  q13: 3,
  q14: "Silver IV",
  q15: "2025-03-17",
  q16: "2025-06-17"
};

const f = document.getElementById("triviaForm");
const result = document.getElementById("result");
const codeWrap = document.getElementById("codeWrap");
const copyBtn = document.getElementById("copyBtn");

function norm(s) { return s.trim().toLowerCase().replace(/\s+/g,' '); }
function num(v) { return Number(String(v).trim()); }
function includesOne(arr, val) {
  const v = norm(val);
  return arr.map(norm).includes(v);
}
function daysSince(dateStr) {
  const start = new Date(dateStr);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = todayMidnight - start;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function checkQ5(val) {
  // allow "iphone 12" variants and bare "12"
  const v = norm(val).replace(/\s+/g,'').replace(/-+/g,'');
  const allowed = ["iphone12","12","appleiphone12"];
  return allowed.includes(v);
}

function checkQ6(val) {
  const v = norm(val);
  // Accept if it contains "rach" anywhere OR matches a known variant or misspell
  if (v.includes("rach")) return true;
  const variants = CORRECT.q6.map(norm);
  return variants.includes(v);
}

if (f) {
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    result.textContent = "";
    if (codeWrap) codeWrap.style.display = "none";

    let score = 0, total = 17, errors = [];

    // 1
    if (num(q1.value) === CORRECT.q1) score++; else errors.push("Q1");
    // 2
    if (num(q2.value) === CORRECT.q2) score++; else errors.push("Q2");
    // 3
    if (includesOne(CORRECT.q3, q3.value)) score++; else errors.push("Q3");
    // 4
    if (num(q4.value) === CORRECT.q4) score++; else errors.push("Q4");
    // 5
    if (checkQ5(q5.value)) score++; else errors.push("Q5");
    // 6
    if (checkQ6(q6.value)) score++; else errors.push("Q6");
    // 7
    if (includesOne(CORRECT.q7, q7.value)) score++; else errors.push("Q7");
    // 8 (accepts 16:00 or 4:00 PM / 4 PM)
    const val8 = q8.value.trim();
    let ok8 = false;
    if (val8 === CORRECT.q8) {
      ok8 = true;
    } else {
      const v = val8.toLowerCase().replace(/\s+/g,'');
      if (v === "4:00pm" || v === "4pm") ok8 = true;
    }
    if (ok8) score++; else errors.push("Q8");
    // 9
    if (includesOne(CORRECT.q9, q9.value)) score++; else errors.push("Q9");
    // 10
    const roles = Array.from(document.querySelectorAll('input[name="q10"]:checked')).map(i=>i.value);
    roles.sort();
    const want = [...CORRECT.q10].sort();
    if (roles.length === 2 && roles[0] === want[0] && roles[1] === want[1]) score++; else errors.push("Q10");
    // 11
    const q11el = document.querySelector('input[name="q11"]:checked');
    if (q11el && q11el.value === CORRECT.q11) score++; else errors.push("Q11");
    // 12
    const q12el = document.querySelector('input[name="q12"]:checked');
    if (q12el && q12el.value === CORRECT.q12) score++; else errors.push("Q12");
    // 13
    if (num(q13.value) === CORRECT.q13) score++; else errors.push("Q13");
    // 14
    const q14el = document.querySelector('input[name="q14"]:checked');
    if (q14el && q14el.value === CORRECT.q14) score++; else errors.push("Q14");
    // 15
    if (q15.value === CORRECT.q15) score++; else errors.push("Q15");
    // 16
    if (q16.value === CORRECT.q16) score++; else errors.push("Q16");
    // 17 (dynamic: days since 2025-06-17)
    const correctDays = daysSince("2025-06-17T00:00:00");
    if (num(q17.value) === correctDays) score++; else errors.push("Q17");

    if (score === total) {
      result.className = "ok";
      result.textContent = "Perfect! You unlocked the code.";
      const codeEl = document.getElementById("code");
      if (codeEl) codeEl.textContent = ACCESS_CODE;
      if (codeWrap) codeWrap.style.display = "block";
    } else {
      result.className = "err";
      result.textContent = `You got ${score}/${total}. Check: ${errors.join(", ")}.`;
    }
  });
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const code = document.getElementById("code")?.textContent || "";
    try {
      await navigator.clipboard.writeText(code);
      copyBtn.textContent = "Copied!";
      setTimeout(()=> copyBtn.textContent = "Copy code", 1200);
    } catch {
      copyBtn.textContent = "Press Ctrl/Cmd+C";
      setTimeout(()=> copyBtn.textContent = "Copy code", 1200);
    }
  });
}

// Limit exactly 2 selections for Q10 (UX guard)
const roleBoxes = document.querySelectorAll('input[name="q10"]');
roleBoxes.forEach(cb => {
  cb.addEventListener("change", () => {
    const selected = Array.from(roleBoxes).filter(x=>x.checked);
    if (selected.length > 2) {
      // uncheck the one just checked
      cb.checked = false;
    }
  });
});
