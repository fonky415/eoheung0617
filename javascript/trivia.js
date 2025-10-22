(function (window, document) {
  const form = document.getElementById("triviaForm");
  if (!form) return;

  const loveSite = window.LoveSite || {};
  const utils = loveSite.utils;
  const trivia = loveSite.trivia;
  if (!utils || !trivia) return;

  const { correctAnswers: CORRECT, accessCode: ACCESS_CODE, triviaStartDate } = trivia;

  const result = document.getElementById("result");
  const codeWrap = document.getElementById("codeWrap");
  const copyBtn = document.getElementById("copyBtn");
  const codeEl = document.getElementById("code");

  const q1 = document.getElementById("q1");
  const q2 = document.getElementById("q2");
  const q3 = document.getElementById("q3");
  const q4 = document.getElementById("q4");
  const q5 = document.getElementById("q5");
  const q6 = document.getElementById("q6");
  const q7 = document.getElementById("q7");
  const q8 = document.getElementById("q8");
  const q9 = document.getElementById("q9");
  const q13 = document.getElementById("q13");
  const q15 = document.getElementById("q15");
  const q16 = document.getElementById("q16");
  const q17 = document.getElementById("q17");

  const q10Boxes = form.querySelectorAll('input[name="q10"]');

  function includesOne(options, value) {
    return options.map(utils.normalize).includes(utils.normalize(value));
  }

  function checkQ5(value) {
    const stripped = utils.normalize(value).replace(/\s+/g, "").replace(/-+/g, "");
    const allowed = ["iphone12", "12", "appleiphone12"];
    return allowed.includes(stripped);
  }

  function checkQ6(value) {
    const normalized = utils.normalize(value);
    if (normalized.includes("rach")) return true;
    const variants = CORRECT.q6.map(utils.normalize);
    return variants.includes(normalized);
  }

  function checkTime(value) {
    if (!value) return false;
    if (value === CORRECT.q8) return true;
    const compact = value.toLowerCase().replace(/\s+/g, "");
    return compact === "4:00pm" || compact === "4pm";
  }

  function evaluate() {
    let score = 0;
    const total = 17;
    const errors = [];

    if (utils.toNumber(q1.value) === CORRECT.q1) score++; else errors.push("Q1");
    if (utils.toNumber(q2.value) === CORRECT.q2) score++; else errors.push("Q2");
    if (includesOne(CORRECT.q3, q3.value)) score++; else errors.push("Q3");
    if (utils.toNumber(q4.value) === CORRECT.q4) score++; else errors.push("Q4");
    if (checkQ5(q5.value)) score++; else errors.push("Q5");
    if (checkQ6(q6.value)) score++; else errors.push("Q6");
    if (includesOne(CORRECT.q7, q7.value)) score++; else errors.push("Q7");
    if (checkTime(q8.value)) score++; else errors.push("Q8");
    if (includesOne(CORRECT.q9, q9.value)) score++; else errors.push("Q9");

    const selectedRoles = Array.from(form.querySelectorAll('input[name="q10"]:checked'))
      .map((input) => input.value)
      .sort();
    const wantedRoles = [...CORRECT.q10].sort();
    if (
      selectedRoles.length === wantedRoles.length &&
      selectedRoles.every((value, index) => value === wantedRoles[index])
    ) {
      score++;
    } else {
      errors.push("Q10");
    }

    const q11El = form.querySelector('input[name="q11"]:checked');
    if (q11El && q11El.value === CORRECT.q11) score++; else errors.push("Q11");

    const q12El = form.querySelector('input[name="q12"]:checked');
    if (q12El && q12El.value === CORRECT.q12) score++; else errors.push("Q12");

    if (utils.toNumber(q13.value) === CORRECT.q13) score++; else errors.push("Q13");

    const q14El = form.querySelector('input[name="q14"]:checked');
    if (q14El && q14El.value === CORRECT.q14) score++; else errors.push("Q14");

    if (q15.value === CORRECT.q15) score++; else errors.push("Q15");
    if (q16.value === CORRECT.q16) score++; else errors.push("Q16");

    const correctDays = utils.daysSince(triviaStartDate);
    if (utils.toNumber(q17.value) === correctDays) score++; else errors.push("Q17");

    return { score, total, errors };
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (result) result.textContent = "";
    if (codeWrap) codeWrap.style.display = "none";

    const { score, total, errors } = evaluate();

    if (score === total) {
      result.className = "ok";
      result.textContent = "Perfect! You unlocked the code.";
      if (codeEl) codeEl.textContent = ACCESS_CODE;
      if (codeWrap) codeWrap.style.display = "block";
    } else {
      result.className = "err";
      result.textContent = `You got ${score}/${total}. Check: ${errors.join(", ")}.`;
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const code = codeEl?.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy code";
        }, 1200);
      } catch (error) {
        copyBtn.textContent = "Press Ctrl/Cmd+C";
        setTimeout(() => {
          copyBtn.textContent = "Copy code";
        }, 1200);
      }
    });
  }

  q10Boxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selected = Array.from(q10Boxes).filter((input) => input.checked);
      if (selected.length > CORRECT.q10.length) {
        checkbox.checked = false;
      }
    });
  });
})(window, document);
