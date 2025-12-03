const questions = [
  {
    videoId: 'ho9rZjlsyYY',
    title: 'Gloria, RV589',
    composer: 'Vivaldi'
  },
  {
    videoId: 'Xvax4uIFYu0',
    title: 'Violin Concerto in E-flat major "La Tempesta di Mare"',
    composer: 'Vivaldi'
  },
  {
    videoId: 'LU_QR_FTt3E',
    title: 'Cello Suite No.2 in D minor BWV 1008',
    composer: 'Bach'
  },
  {
    videoId: 'va0WeYbwFAQ',
    title: 'Water Music Suites Nos. 1–3',
    composer: 'Handel'
  },
  {
    videoId: 'OMhByUiZikY',
    title: 'Arrival Of The Queen Of Sheba',
    composer: 'Handel'
  },
  {
    videoId: 'V9zz7HMO-Qc',
    title: 'Israel in Egypt',
    composer: 'Handel'
  },
  {
    videoId: 'FBnAZKYNd_E',
    title: 'Concerto for Two Violins in D minor BWV 1043',
    composer: 'Bach'
  },
  {
    videoId: 'ho9rZjlsyYY',
    title: 'Toccata and Fugue in D minor',
    composer: 'Bach'
  },
  {
    videoId: 'XZXXR3eJ-24',
    title: 'French Suite No.2 in C minor BWV 813',
    composer: 'Bach'
  },
  {
    videoId: 'rrVDATvThp8',
    title: 'Air on the G String',
    composer: 'Bach'
  }
];

// Constants for timing and animation
const ANIMATION_DURATION = {
  CORRECT_FLASH: 500,
  INCORRECT_DELAY: 500,
  FADE_OUT: 400
};

// State
let player;
let currentQuestion = 0;
let answered = false;

// DOM Elements
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const composerOptions = document.getElementById('composerOptions');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');

// YouTube API Ready Handler
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtubePlayer', {
    height: '0',
    width: '0',
    videoId: questions[0].videoId,
    playerVars: {
      autoplay: 0,
      controls: 0
    },
    events: {
      onReady: onPlayerReady
    }
  });
}

function onPlayerReady() {
  updateProgress();
}

function updateProgress() {
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  // Show accurate progress including current question
  const percentage = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = `${percentage}%`;
}

function loadQuestion() {
  answered = false;
  feedback.textContent = '';
  feedback.classList.remove('correct', 'incorrect');
  nextBtn.hidden = true;
  
  document.querySelectorAll('.composer-btn').forEach(btn => {
    btn.disabled = false;
  });
  
  player.loadVideoById(questions[currentQuestion].videoId);
  updateProgress();
  
  playBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Play/Pause Controls
playBtn.addEventListener('click', () => {
  player.playVideo();
  playBtn.disabled = true;
  pauseBtn.disabled = false;
});

pauseBtn.addEventListener('click', () => {
  player.pauseVideo();
  playBtn.disabled = false;
  pauseBtn.disabled = true;
});

// Composer Selection Handler
composerOptions.addEventListener('click', (e) => {
  if (answered) return;
  
  const btn = e.target.closest('.composer-btn');
  if (!btn) return;
  
  const guess = btn.dataset.composer;
  const correct = questions[currentQuestion].composer;
  
  answered = true;
  
  document.querySelectorAll('.composer-btn').forEach(b => {
    b.disabled = true;
  });
  
  if (guess === correct) {
    feedback.textContent = `Correct! This is ${questions[currentQuestion].title} by ${correct}.`;
    feedback.classList.add('correct');
    document.body.classList.add('flash-correct');
    setTimeout(() => {
      document.body.classList.remove('flash-correct');
    }, ANIMATION_DURATION.CORRECT_FLASH);
    nextBtn.hidden = false;
  } else {
    feedback.textContent = 'Not quite. Try again!';
    feedback.classList.add('incorrect');
    document.body.classList.add('flash-incorrect');
    setTimeout(() => {
      document.body.classList.remove('flash-incorrect');
      answered = false;
      feedback.textContent = '';
      feedback.classList.remove('incorrect');
      document.querySelectorAll('.composer-btn').forEach(b => {
        b.disabled = false;
      });
    }, ANIMATION_DURATION.INCORRECT_DELAY);
  }
});

// Next Button Handler - using named function
function handleNextQuestion() {
  currentQuestion++;
  
  if (currentQuestion >= questions.length) {
    showCompletionScreen();
  } else {
    loadQuestion();
  }
}

function showCompletionScreen() {
  feedback.textContent = 'Perfect! Your access code is: "Listening"';
  feedback.classList.remove('correct', 'incorrect');
  feedback.classList.add('correct');
  nextBtn.textContent = 'Continue to Letter';
  nextBtn.hidden = false;
  
  // Remove the old handler and add the new one
  nextBtn.removeEventListener('click', handleNextQuestion);
  nextBtn.addEventListener('click', handleContinueToLetter, { once: true });
}

function handleContinueToLetter() {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = 'letter5.html';
  }, ANIMATION_DURATION.FADE_OUT);
}

// Attach initial next button handler
nextBtn.addEventListener('click', handleNextQuestion);

// Make onYouTubeIframeAPIReady available globally
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;