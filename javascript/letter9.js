const introSlide = document.querySelector('[data-slide="intro"]');
const questionSlide = document.querySelector('[data-slide="question"]');
const proceedBtn = document.querySelector('#proceedBtn');
const drawingImage = document.querySelector('#drawingImage');
const drawingCounter = document.querySelector('#drawingCounter');
const answerForm = document.querySelector('#answerForm');
const answerInput = document.querySelector('#answerInput');
const feedbackEl = document.querySelector('#feedback');
const nextBtn = document.querySelector('#nextBtn');
const completionCard = document.querySelector('#completionCard');

const tasks = [
  {
    image: '../photos/border collie.jpg',
    alt: 'Border collie drawing',
    answers: ['border collie'],
  },
  {
    image: '../photos/sticky toffee pudding.jpg',
    alt: 'Sticky toffee pudding drawing',
    answers: ['sticky toffee pudding'],
  },
  {
    image: '../photos/phillip sketch.jpg',
    alt: 'Phillip drawing',
    answers: ['phillip', 'philip'],
  },
  {
    image: '../photos/giving hickey.jpg',
    alt: 'Giving hickey drawing',
    answers: ['giving hickey', 'giving a hickey', 'hickey'],
  },
  {
    image: '../photos/bellavitano cheese.jpg',
    alt: 'Bellavitano cheese drawing',
    answers: ['bellavitano cheese', 'bellavitano'],
  },
  {
    image: '../photos/cat sketch.jpg',
    alt: 'Cat drawing',
    answers: ['cat'],
  },
];

let currentTaskIndex = 0;

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function showSlide(slide) {
  const allSlides = document.querySelectorAll('.slide');
  allSlides.forEach((item) => {
    item.hidden = item !== slide;
  });
}

function renderTask() {
  const task = tasks[currentTaskIndex];
  drawingImage.src = task.image;
  drawingImage.alt = task.alt;
  drawingCounter.textContent = `Drawing ${currentTaskIndex + 1} of ${tasks.length}`;
  answerInput.value = '';
  answerInput.disabled = false;
  answerInput.focus();
  nextBtn.hidden = true;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
}

function showCompletion() {
  questionSlide.hidden = true;
  completionCard.hidden = false;
}

function handleProceed() {
  showSlide(questionSlide);
  renderTask();
}

function handleAnswer(event) {
  event.preventDefault();
  const answer = normalize(answerInput.value);

  if (!answer) {
    return;
  }

  if (answer === 'cheese') {
    feedbackEl.textContent = 'what kind?';
    feedbackEl.className = 'feedback incorrect';
    return;
  }

  const task = tasks[currentTaskIndex];
  const isCorrect = task.answers.some((expected) => normalize(expected) === answer);

  if (isCorrect) {
    feedbackEl.textContent = 'you know your stuff okay okay';
    feedbackEl.className = 'feedback correct';
    answerInput.disabled = true;
    nextBtn.hidden = false;
    nextBtn.focus();
  } else {
    feedbackEl.textContent = "maybe you don't need it...";
    feedbackEl.className = 'feedback incorrect';
    answerInput.value = '';
    answerInput.focus();
  }
}

function handleNext() {
  if (currentTaskIndex < tasks.length - 1) {
    currentTaskIndex += 1;
    renderTask();
  } else {
    showCompletion();
  }
}

proceedBtn.addEventListener('click', handleProceed);
answerForm.addEventListener('submit', handleAnswer);
nextBtn.addEventListener('click', handleNext);
