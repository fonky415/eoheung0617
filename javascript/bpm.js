(function (window, document) {
  const DURATION = 5; // 5 seconds
  const MIN_BPM = 100;
  const MAX_BPM = 120;

  let gameState = {
    isRunning: false,
    startTime: null,
    spacePresses: [],
  };

  const instructionArea = document.getElementById('instructionArea');
  const startBtn = document.getElementById('startBtn');
  const gameArea = document.getElementById('gameArea');
  const countdown = document.getElementById('countdown');
  const result = document.getElementById('result');
  const resultMessage = document.getElementById('resultMessage');
  const passwordDisplay = document.getElementById('passwordDisplay');
  const restartBtn = document.getElementById('restartBtn');
  const homeBtn = document.getElementById('homeBtn');

  function startCountdown() {
    gameState.isRunning = true;
    gameState.startTime = Date.now();
    gameState.spacePresses = [];

    instructionArea.style.display = 'none';
    gameArea.style.display = 'block';
    result.style.display = 'none';
    countdown.textContent = DURATION;
    countdown.style.opacity = '1';

    let remaining = DURATION;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      remaining = Math.max(0, DURATION - elapsed);

      countdown.textContent = Math.ceil(remaining);
      countdown.style.opacity = String(remaining / DURATION);

      if (remaining <= 0) {
        clearInterval(interval);
        endGame();
      }
    }, 50);
  }

  function handleSpacePress(event) {
    if (event.code !== 'Space') return;
    if (!gameState.isRunning) return;

    event.preventDefault();
    gameState.spacePresses.push(Date.now());
  }

  function endGame() {
    gameState.isRunning = false;

    const elapsedTime = (Date.now() - gameState.startTime) / 1000; // convert to seconds
    const numPresses = gameState.spacePresses.length;

    // Calculate BPM: (taps / time in seconds) * 60
    const bpm = (numPresses / elapsedTime) * 60;

    showResult(bpm, numPresses, elapsedTime);
  }

  function showResult(bpm, taps, time) {
    gameArea.style.display = 'none';
    result.style.display = 'block';

    const success = bpm >= MIN_BPM && bpm <= MAX_BPM;

    if (success) {
      resultMessage.textContent = '✓ You got it!';
      resultMessage.style.color = 'green';
      passwordDisplay.style.display = 'block';
      restartBtn.style.display = 'none';
      homeBtn.style.display = 'inline-block';
    } else {
      if (bpm < MIN_BPM) {
        resultMessage.textContent = "TOO SLOW MY ORGANS DON'T HAVE ENOUGH OXYGENATED BLOOD";
      } else {
        resultMessage.textContent = "TOO FAST MY HEART ISN'T FILLING ENOUGH BLOOD PER COMPRESSION";
      }
      resultMessage.style.color = 'crimson';
      passwordDisplay.style.display = 'none';
      restartBtn.style.display = 'inline-block';
      homeBtn.style.display = 'none';
    }
  }

  function init() {
    document.addEventListener('keydown', handleSpacePress);
  }

  startBtn.addEventListener('click', () => {
    startCountdown();
  });

  restartBtn.addEventListener('click', () => {
    instructionArea.style.display = 'block';
    gameArea.style.display = 'none';
    result.style.display = 'none';
  });

  init();
})(window, document);
