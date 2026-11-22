(() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CENTER_X = 180;
  const CENTER_Y = 218;
  const NEEDLE_RADIUS = 130;
  const HANDLE_RADIUS = 145;
  const OUTER_WEDGE_RADIUS = 135;
  const INNER_WEDGE_RADIUS = 54;
  const PASS_TOLERANCE = 0.1;
  const WEDGE_COLORS = ['#e8b94f', '#7da77d', '#e8894a', '#7da77d', '#e8b94f'];

  const rounds = [
    {
      question: "Longest time we've been apart",
      minimum: 0,
      maximum: 100,
      unit: 'days',
      target: 97,
    },
    {
      question: "Longest stretch we've spent together",
      minimum: 0,
      maximum: 100,
      unit: 'days',
      target: 21,
    },
    {
      question: 'Farthest distance travelled',
      minimum: 0,
      maximum: 20000,
      unit: 'km',
      target: 12090,
    },
    {
      question: 'Total days together since we started dating, including times with others (e.g. Jinu, Priyam)',
      minimum: 0,
      maximum: 100,
      unit: 'days',
      target: 91,
    },
  ];

  const screens = {
    intro: document.getElementById('introScreen'),
    round: document.getElementById('roundScreen'),
    miss: document.getElementById('missScreen'),
    win: document.getElementById('winScreen'),
  };
  const progress = document.getElementById('roundProgress');
  const questionText = document.getElementById('questionText');
  const minimumLabel = document.getElementById('minimumLabel');
  const maximumLabel = document.getElementById('maximumLabel');
  const dialSvg = document.getElementById('dialSvg');
  const needleControl = document.getElementById('needleControl');
  const needle = document.getElementById('needle');
  const dialHandle = document.getElementById('dialHandle');
  const valueBubble = document.getElementById('valueBubble');
  const valueText = document.getElementById('valueText');
  const scoreWedges = document.getElementById('scoreWedges');
  const confirmButton = document.getElementById('confirmButton');
  const feedback = document.getElementById('roundFeedback');
  const nextButton = document.getElementById('nextButton');
  let currentRoundIndex = 0;
  let guessValue = 50;
  let isDragging = false;
  let isLocked = false;

  function showScreen(screenToShow) {
    Object.values(screens).forEach((screen) => {
      screen.hidden = screen !== screenToShow;
    });
  }

  function formatValue(value, unit) {
    return `${new Intl.NumberFormat('en-US').format(value)} ${unit}`;
  }

  function angleForValue(value, round) {
    const fraction = (value - round.minimum) / (round.maximum - round.minimum);
    return Math.PI * (1 - fraction);
  }

  function updateDial() {
    const round = rounds[currentRoundIndex];
    const angle = angleForValue(guessValue, round);
    const tipX = CENTER_X + NEEDLE_RADIUS * Math.cos(angle);
    const tipY = CENTER_Y - NEEDLE_RADIUS * Math.sin(angle);
    const handleX = CENTER_X + HANDLE_RADIUS * Math.cos(angle);
    const handleY = CENTER_Y - HANDLE_RADIUS * Math.sin(angle);
    const bubbleX = Math.min(302, Math.max(58, tipX));

    needle.setAttribute('x2', tipX);
    needle.setAttribute('y2', tipY);
    dialHandle.setAttribute('cx', handleX);
    dialHandle.setAttribute('cy', handleY);
    valueBubble.setAttribute('transform', `translate(${bubbleX} ${tipY - 5})`);
    valueText.textContent = formatValue(guessValue, round.unit);
    needleControl.setAttribute('aria-valuemin', round.minimum);
    needleControl.setAttribute('aria-valuemax', round.maximum);
    needleControl.setAttribute('aria-valuenow', guessValue);
    needleControl.setAttribute('aria-valuetext', formatValue(guessValue, round.unit));
  }

  function renderRound() {
    const round = rounds[currentRoundIndex];
    progress.textContent = `Round ${currentRoundIndex + 1} of ${rounds.length}`;
    questionText.textContent = round.question;
    minimumLabel.textContent = formatValue(round.minimum, round.unit);
    maximumLabel.textContent = formatValue(round.maximum, round.unit);
    guessValue = Math.round((round.minimum + round.maximum) / 2);
    isLocked = false;
    needleControl.setAttribute('aria-disabled', 'false');
    scoreWedges.replaceChildren();
    scoreWedges.hidden = true;
    confirmButton.disabled = false;
    feedback.textContent = '';
    nextButton.hidden = true;
    updateDial();
    showScreen(screens.round);
  }

  function pointOnArc(radius, angle) {
    return {
      x: CENTER_X + radius * Math.cos(angle),
      y: CENTER_Y - radius * Math.sin(angle),
    };
  }

  function sectorPath(lowValue, highValue, round) {
    const startAngle = angleForValue(highValue, round);
    const endAngle = angleForValue(lowValue, round);
    const innerStart = pointOnArc(INNER_WEDGE_RADIUS, startAngle);
    const outerStart = pointOnArc(OUTER_WEDGE_RADIUS, startAngle);
    const outerEnd = pointOnArc(OUTER_WEDGE_RADIUS, endAngle);
    const innerEnd = pointOnArc(INNER_WEDGE_RADIUS, endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return [
      `M ${innerStart.x} ${innerStart.y}`,
      `L ${outerStart.x} ${outerStart.y}`,
      `A ${OUTER_WEDGE_RADIUS} ${OUTER_WEDGE_RADIUS} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${INNER_WEDGE_RADIUS} ${INNER_WEDGE_RADIUS} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
      'Z',
    ].join(' ');
  }

  function revealWedges(round) {
    const span = round.maximum - round.minimum;
    const boundaries = [
      round.target - span * 0.1,
      round.target - span * 0.06,
      round.target - span * 0.03,
      round.target + span * 0.03,
      round.target + span * 0.06,
      round.target + span * 0.1,
    ].map((value) => Math.max(round.minimum, Math.min(round.maximum, value)));

    scoreWedges.replaceChildren();
    WEDGE_COLORS.forEach((color, index) => {
      const lowValue = boundaries[index];
      const highValue = boundaries[index + 1];
      if (highValue <= lowValue) return;

      const wedge = document.createElementNS(SVG_NS, 'path');
      wedge.setAttribute('d', sectorPath(lowValue, highValue, round));
      wedge.setAttribute('fill', color);
      scoreWedges.appendChild(wedge);
    });
    scoreWedges.hidden = false;
  }

  function confirmGuess() {
    if (isLocked) return;

    const round = rounds[currentRoundIndex];
    const distanceRatio = Math.abs(guessValue - round.target)
      / (round.maximum - round.minimum);

    if (distanceRatio > PASS_TOLERANCE) {
      currentRoundIndex = 0;
      showScreen(screens.miss);
      return;
    }

    isLocked = true;
    confirmButton.disabled = true;
    needleControl.setAttribute('aria-disabled', 'true');
    revealWedges(round);
    feedback.textContent = `NICE! it's exactly ${formatValue(round.target, round.unit)}!`;
    nextButton.hidden = false;
    nextButton.focus();
  }

  function updateGuessFromPointer(event) {
    const screenPoint = dialSvg.createSVGPoint();
    screenPoint.x = event.clientX;
    screenPoint.y = event.clientY;
    const transform = dialSvg.getScreenCTM();
    if (!transform) return;

    const point = screenPoint.matrixTransform(transform.inverse());
    const rise = Math.max(0, CENTER_Y - point.y);
    const angle = Math.atan2(rise, point.x - CENTER_X);
    const fraction = 1 - angle / Math.PI;
    const round = rounds[currentRoundIndex];

    guessValue = Math.round(round.minimum + fraction * (round.maximum - round.minimum));
    updateDial();
  }

  function handlePointerDown(event) {
    if (isLocked) return;
    event.preventDefault();
    isDragging = true;
    dialSvg.setPointerCapture(event.pointerId);
    updateGuessFromPointer(event);
  }

  function handlePointerUp() {
    isDragging = false;
  }

  function handleKeyboard(event) {
    if (isLocked) return;

    const round = rounds[currentRoundIndex];
    const step = Math.max(1, Math.round((round.maximum - round.minimum) / 100));
    let nextValue = guessValue;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextValue -= step;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextValue += step;
    else if (event.key === 'Home') nextValue = round.minimum;
    else if (event.key === 'End') nextValue = round.maximum;
    else return;

    event.preventDefault();
    guessValue = Math.max(round.minimum, Math.min(round.maximum, nextValue));
    updateDial();
  }

  document.addEventListener('keydown', (event) => {
    const isDebugKey = event.code === 'KeyD' || event.key.toLowerCase() === 'd';
    const isDesktopShortcut = event.ctrlKey && event.altKey && !event.metaKey;
    const isMacShortcut = event.metaKey && event.altKey && event.shiftKey;

    if (isDebugKey && (isDesktopShortcut || isMacShortcut)) {
      event.preventDefault();
      window.location.href = 'letter-10-quiz.html?debug=1';
    }
  });

  document.getElementById('startButton').addEventListener('click', renderRound);
  confirmButton.addEventListener('click', confirmGuess);
  nextButton.addEventListener('click', () => {
    if (currentRoundIndex === rounds.length - 1) {
      showScreen(screens.win);
      return;
    }

    currentRoundIndex += 1;
    renderRound();
  });
  document.getElementById('retryButton').addEventListener('click', renderRound);
  document.getElementById('quizButton').addEventListener('click', () => {
    window.location.href = 'letter-10-quiz.html';
  });
  needleControl.addEventListener('pointerdown', handlePointerDown);
  needleControl.addEventListener('keydown', handleKeyboard);
  dialSvg.addEventListener('pointermove', (event) => {
    if (isDragging) updateGuessFromPointer(event);
  });
  dialSvg.addEventListener('pointerup', handlePointerUp);
  dialSvg.addEventListener('pointercancel', handlePointerUp);
})();
