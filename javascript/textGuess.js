const introSlide = document.querySelector('[data-slide="intro"]');
const questionSlide = document.querySelector('[data-slide="question"]');
const proceedBtn = document.querySelector('#proceedBtn');
const livesDisplay = document.querySelector('#livesDisplay');
const feedbackEl = document.querySelector('#feedback');
const nextBtn = document.querySelector('#nextBtn');
const restartBtn = document.querySelector('#restartBtn');
const choices = document.querySelectorAll('.choice');
const hiddenTextEl = document.querySelector('.hidden-text');

const CORRECT_CHOICE = 'a';
const MAX_LIVES = 3;

let lives = MAX_LIVES;
let answeredCorrectly = false;

function updateLivesDisplay() {
  if (!livesDisplay) return;
  const hearts = '❤'.repeat(lives) + '♡'.repeat(MAX_LIVES - lives);
  livesDisplay.textContent = hearts;
  livesDisplay.setAttribute('aria-label', `${lives} lives remaining`);
}

function revealHiddenText() {
  if (!hiddenTextEl) return;
  const original = hiddenTextEl.dataset.original;
  if (original) {
    hiddenTextEl.textContent = original;
    hiddenTextEl.classList.remove('hidden-text');
    hiddenTextEl.removeAttribute('data-original');
  }
}

function handleCorrectChoice(button) {
  answeredCorrectly = true;
  if (feedbackEl) {
    feedbackEl.textContent = 'Correct! That was the very first text you sent.';
    feedbackEl.classList.remove('incorrect');
    feedbackEl.classList.add('correct');
  }

  choices.forEach((choice) => {
    choice.disabled = true;
    if (choice === button) {
      choice.classList.add('is-correct');
    }
  });

  revealHiddenText();

  if (nextBtn) {
    nextBtn.hidden = false;
  }
  if (restartBtn) {
    restartBtn.hidden = true;
  }
}

function handleIncorrectChoice(button) {
  lives -= 1;
  updateLivesDisplay();

  if (feedbackEl) {
    feedbackEl.textContent = lives > 0 ? 'Not quite! Try again.' : 'Game over. Time to start over!';
    feedbackEl.classList.remove('correct');
    feedbackEl.classList.add('incorrect');
  }

  button.disabled = true;

  if (lives <= 0) {
    choices.forEach((choice) => {
      choice.disabled = true;
    });
    if (restartBtn) {
      restartBtn.hidden = false;
    }
  }
}

function onChoiceClick(event) {
  const button = event.currentTarget;
  const userChoice = button.dataset.choice;

  if (answeredCorrectly || button.disabled) {
    return;
  }

  if (userChoice === CORRECT_CHOICE) {
    handleCorrectChoice(button);
  } else {
    handleIncorrectChoice(button);
  }
}

choices.forEach((button) => {
  button.addEventListener('click', onChoiceClick);
});

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    window.location.href = 'textGuess-question2.html';
  });
}

if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    window.location.reload();
  });
}

if (proceedBtn && introSlide && questionSlide) {
  proceedBtn.addEventListener('click', () => {
    introSlide.hidden = true;
    questionSlide.hidden = false;
    if (choices.length > 0) {
      choices[0].focus({ preventScroll: true });
    }
  });
}

updateLivesDisplay();
