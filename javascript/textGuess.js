const introSlide = document.querySelector('[data-slide="intro"]');
const questionSlide = document.querySelector('[data-slide="question"]');
const proceedBtn = document.querySelector('#proceedBtn');
const livesDisplay = document.querySelector('#livesDisplay');
const feedbackEl = document.querySelector('#feedback');
const nextBtn = document.querySelector('#nextBtn');
const restartBtn = document.querySelector('#restartBtn');
const choicesList = document.querySelector('#choicesList');
const frqForm = document.querySelector('#frqForm');
const frqInput = document.querySelector('#frqInput');
const chatMessagesEl = document.querySelector('#chatMessages');
const chatTimestampEl = document.querySelector('#chatTimestamp');
const questionTitleEl = document.querySelector('#question-title');
const questionSubtitleEl = document.querySelector('#questionSubtitle');
const questionTextEl = document.querySelector('#questionText');
const questionCard = document.querySelector('#questionCard');
const completionCard = document.querySelector('#completionCard');

const HASH_PREFIX = 'q';
const COMPLETE_HASH = 'complete';

const MAX_LIVES = 3;

const questions = [
  {
    title: 'our first text',
    subtitle: 'MCQ',
    timestamp: 'Oct 27, 2024 11:46 pm',
    prompt: 'What was the very first text in this thread?',
    type: 'mcq',
    options: [
      {
        key: 'a',
        text: 'phillip do you have access to 9th and 10th grade photos? Like the ones they use for powerschool?',
        correct: true,
      },
      {
        key: 'b',
        text: 'hey phillip youre in yearbook right? do you have 9th and 10th grade photos?',
      },
      {
        key: 'c',
        text: 'phillip do you still have powerschool photos of 9th and 10th graders?',
      },
      {
        key: 'd',
        text: 'phillip 사실 i think i love you',
      },
    ],
    messages: [
      {
        sender: 'Jinny',
        body: '[phillip do you have access to 9th and 10th grade photos? Like the ones they use for powerschool?]',
        hidden: true,
      },
      {
        sender: 'Phillip Han',
        body: 'I’m not sure I never looked for them',
      },
      {
        sender: 'Phillip Han',
        body: 'Why',
      },
      {
        sender: 'Jinny',
        body: 'cuz me and susie need the photos of the jv basketball kids so we know what they look like..',
      },
      {
        sender: 'Phillip Han',
        body: 'Well sorry I looked for it but it’s not in yearbook drive',
      },
      {
        sender: 'Jinny',
        body: 'Ohhh its okay thenn',
      },
      {
        sender: 'Jinny',
        body: 'Thanks for looking for itt',
        footer: '❤Phillip Han (Oct 28, 2024 2:29 am)',
      },
    ],
  },
  {
    title: 'plan b??',
    subtitle: 'MCQ',
    timestamp: 'Dec 14, 2024 7:17 am',
    prompt: 'Fill in Phillip\'s plan.',
    type: 'mcq',
    options: [
      { key: 'a', text: 'just be housewife' },
      { key: 'b', text: 'just be swim coach', correct: true },
      { key: 'c', text: 'just be farmer' },
      { key: 'd', text: 'just be school counselor' },
    ],
    messages: [
  {
    sender: 'Phillip Han',
    body: 'damn',
  },
  {
    sender: 'Jinny',
    body: 'I- what',
  },
  {
    sender: 'Phillip Han',
    body: 'alright if none of us goes to college',
  },
  {
    sender: 'Jinny',
    body: 'Thats just traumatizing',
  },
  {
    sender: 'Phillip Han',
    body: '[just be swim coach]',
    hidden: true,
    footer: '❤Jinny (Dec 14, 2024 7:18 am)',
  },
]
  },
  {
    title: 'HEAVEN',
    subtitle: 'MCQ',
    timestamp: '',
    prompt: 'What was Phillip about to do?',
    type: 'mcq',
    options: [
      { key: 'a', text: 'and i got it for FREE' },
      { key: 'b', text: 'im so hungry' },
      { key: 'c', text: 'theres so much' },
      { key: 'd', text: 'while about to play league of legends', correct: true },
    ],
    messages: [
      { sender: '한필립', body: 'i am actually in HEAVEN rn' },
      { sender: 'Jinny', body: 'Hiii' },
      { sender: 'Jinny', body: 'Why?' },
      { sender: '한필립', body: 'i am' },
      { sender: '한필립', body: 'eating chicken' },
      { sender: 'Jinny', body: 'Niceeee' },
      {
        sender: '한필립',
        body: '[while about to play league of legends]',
        hidden: true,
      },
      { sender: '한필립', body: 'oh my god' },
      { sender: 'Jinny', body: 'ㅋㅋㅋㅋㅋ' },
    ],
  },
  {
    title: 'drunk.?',
    subtitle: 'MCQ',
    timestamp: '',
    prompt: 'What did Jinny say before being asked if she was drunk?',
    type: 'mcq',
    options: [
      { key: 'a', text: 'i love you' },
      { key: 'b', text: 'i miss you', correct: true },
      { key: 'c', text: 'im bombing the white house' },
      { key: 'd', text: 'heheheh' },
    ],
    messages: [
      { sender: '한필립', body: 'krw just weakened s' },
      { sender: '한필립', body: 'sm' },
      { sender: 'Jinny', body: 'mhm' },
      { sender: '한필립', body: "okay that's like" },
      { sender: '한필립', body: 'usd just being rly stupid rn' },
      { sender: '한필립', body: 'whatever' },
      {
        sender: 'Jinny',
        body: '[i miss you]',
        hidden: true,
      },
      { sender: '한필립', body: 'are you drunk???' },
    ],
  },
  {
    title: 'erm',
    subtitle: 'MCQ',
    timestamp: '',
    prompt: 'What was Phillip\'s final message here?',
    type: 'mcq',
    options: [
      { key: 'a', text: 'perhaps' },
      { key: 'b', text: 'nahhhh' },
      { key: 'c', text: 'ㅇㅅㅇ', correct: true },
      { key: 'd', text: 'hehe' },
    ],
    messages: [
  { sender: 'Jinny', body: 'Hows orientation going' },
  { sender: '한필립', body: "they're yapping" },
  { sender: '한필립', body: "but i can't fully play league" },
  { sender: 'Jinny', body: 'LMAO' },
  { sender: '한필립', body: 'because we need to go to breakout rooms' },
  { sender: 'Jinny', body: 'Mmmm' },
  { sender: '한필립', body: 'so' },
  { sender: 'Jinny', body: 'But still playing i assume?' },
  { sender: '한필립', body: 'ermm' },
  { sender: '한필립', body: '[ㅇㅅㅇ]', hidden: true },
]
  },
  {
    title: 'IM SORRY',
    subtitle: 'FRQ',
    timestamp: '',
    prompt: 'Fill in the missing text.',
    type: 'frq',
    answer: 'I missed the bus',
    hint: 'Hint: I missed the ____',
    messages: [
      { sender: 'Jinny', body: 'I just landedd' },
      { sender: '한필립', body: 'WHAT' },
      { sender: 'Jinny', body: 'ㅋㅋㅋㅋㅋ' },
      { sender: 'Jinny', body: 'It landed so early' },
      { sender: 'Jinny', body: 'But im gonna take forever inside anyways' },
      { sender: 'Jinny', body: 'We havent even stopped yet' },
      { sender: 'Jinny', body: 'So i’ll probably get out around like 5:30-5:50' },
      { sender: '한필립', body: 'Bro' },
      {
        sender: '한필립',
        body: '[I missed the bus]',
        hidden: true,
      },
      {
        sender: '한필립',
        body: 'Which means that if I get a ticket right now I will arrive at 6:20',
      },
    ],
  },
  {
    title: 'no expensive',
    subtitle: 'FRQ',
    timestamp: '2025-07-12 16:11:25',
    prompt: 'Complete the hidden text.',
    type: 'frq',
    answer: 'NOTHING EXPENSIVE',
    hint: 'Hint: NOTHING _________',
    messages: [
      { sender: 'Jinny', body: 'Do you think you might want something from london' },
      { sender: 'Jinny', body: 'Or should i just go slightly crazy' },
      { sender: '한필립', body: 'ㅋㅋㅌㅋㅌㅋㅋ am i gonna get a star shaped 미역 now' },
      { sender: '한필립', body: 'hmmmmmm' },
      { sender: '한필립', body: 'let me think' },
      { sender: 'Jinny', body: 'ㅋㅋㅋㅋㅋㅋ' },
      { sender: 'Jinny', body: 'I’ll get you heart shaped tea' },
      { sender: '한필립', body: 'lmaooo heart shaped everything' },
      { sender: '한필립', body: "okok i can't think of SHIT" },
      { sender: 'Jinny', body: 'ㅋㅋㅋㅋㅋㅋ' },
      { sender: 'Jinny', body: 'I guess i’ll just have to go a bit crazy' },
      { sender: 'Jinny', body: 'Network is so ass oh my hod' },
      { sender: '한필립', body: 'HEY' },
      { sender: '한필립', body: '[NOTHING EXPENSIVE]', hidden: true },
      { sender: '한필립', body: '최대 만원' },
      { sender: '한필립', body: '알았지?' },
    ],
  },
  {
    title: 'explaination',
    subtitle: 'MCQ',
    timestamp: '2025-08-14 23:41:34',
    prompt: 'What did Phillip admit?',
    type: 'mcq',
    options: [
      { key: 'a', text: 'I couldn’t pull out' },
      { key: 'b', text: 'Jinny trapped me on her bed' },
      { key: 'c', text: 'I was being turned into 백지' },
      { key: 'd', text: 'I was having passionate sex', correct: true },
    ],
    messages: [
      { sender: '한필립', body: 'Ok' },
      { sender: '한필립', body: 'I’m jusg' },
      { sender: 'Jinny', body: 'ㅋㅋㅋ i was just about to text you' },
      { sender: '한필립', body: 'Gonna go the honest route' },
      { sender: '한필립', body: 'You go shower' },
      { sender: '한필립', body: 'Dw about me' },
      { sender: 'Jinny', body: 'Wait so whats the honest route??' },
      { sender: '한필립', body: 'So' },
      { sender: '한필립', body: '[I was having passionate sex]', hidden: true },
      { sender: 'Jinny', body: 'Bro—' },
    ],
  },
  {
    title: 'greedy',
    subtitle: 'MCQ',
    timestamp: 'Dec 15, 2024 8:57 am',
    prompt: "Complete Phillip's thought.",
    type: 'mcq',
    options: [
      { key: 'a', text: 'just give me everything' },
      { key: 'b', text: 'i mean i want everythin', correct: true },
      { key: 'c', text: 'can i have both' },
      { key: 'd', text: 'can we have some quality time and service and some physical touch as well' },
    ],
    messages: [
  { sender: 'Phillip Han', body: 'idk how im supposed to answer this' },
  { sender: 'Jinny', body: 'Bro i thought so too' },
  { sender: 'Jinny', body: 'Idek' },
  { sender: 'Jinny', body: 'I think' },
  { sender: 'Phillip Han', body: 'is it same for u' },
  { sender: 'Jinny', body: 'Acts of service and quality time' },
  { sender: 'Phillip Han', body: 'yes' },
  { sender: 'Jinny', body: 'But quality time and service kinda come hand in hand' },
  { sender: 'Jinny', body: 'I think' },
  { sender: 'Phillip Han', body: 'yeah' },
  {
    sender: 'Phillip Han',
    body: '[i mean i want everythin]',
    hidden: true,
    footer: '❤Jinny (Dec 15, 2024 8:57 am)',
  },
  { sender: 'Phillip Han', body: "i'm greedy" },
]
  },
  {
    title: 'ANI',
    subtitle: 'FRQ',
    timestamp: 'Dec 15, 2024 4:59 am',
    prompt: "Finish Phillip's hidden text (two letters).",
    type: 'frq',
    answer: 'ok',
    hint: 'Hint: two letters',
    messages: [
  { sender: 'Phillip Han', body: 'WHAT' },
  { sender: 'Phillip Han', body: 'WHAT' },
  { sender: 'Jinny', body: 'BRO WDYM' },
  { sender: 'Phillip Han', body: 'bro' },
  { sender: 'Jinny', body: 'I DONT EVEN RECOGNIZE THE REST' },
  { sender: 'Phillip Han', body: "nolan's british" },
  { sender: 'Jinny', body: 'EXCEPT OPPENHEIMER' },
  { sender: 'Phillip Han', body: 'huh?????????????????' },
  { sender: 'Phillip Han', body: 'inception???????' },
  { sender: 'Phillip Han', body: 'dark knights??????' },
  { sender: 'Jinny', body: 'Okay i know batman' },
  { sender: 'Jinny', body: 'IDKKKKK BRO' },
  { sender: 'Phillip Han', body: 'ok im' },
  { sender: 'Phillip Han', body: '[ok]', hidden: true },
  { sender: 'Jinny', body: 'Speechless' },
  { sender: 'Jinny', body: 'Once again' },
]
  },
  {
    title: 'buy clothess',
    subtitle: 'MCQ',
    timestamp: '2025-08-17 17:17:59',
    prompt: 'What did Phillip say about daily clothes?',
    type: 'mcq',
    options: [
      { key: 'a', text: 'you mean rags' },
      { key: 'b', text: 'ur daily clothes are basically funeral clothes', correct: true },
      { key: 'c', text: 'still buy new ones' },
      { key: 'd', text: 'clothes and new clothes are' },
    ],
    messages: [
      { sender: '한필립', body: 'old clothes are comfy but' },
      { sender: '한필립', body: 'new clothes are pretty' },
      { sender: 'Jinny', body: 'mm' },
      { sender: 'Jinny', body: 'i have formal clothes now so i dont have to worry about that' },
      { sender: 'Jinny', body: 'i have bathing suit' },
      { sender: '한필립', body: 'or else im gonna make u wear my 남친 merch' },
      { sender: 'Jinny', body: 'i have daily clothes' },
      { sender: 'Jinny', body: 'LMAOOO' },
      { sender: 'Jinny', body: 'ㅋㅋㅋㅋㅋㅋ' },
      {
        sender: '한필립',
        body: '[ur daily clothes are basically funeral clothes]',
        hidden: true,
      },
      { sender: '한필립', body: 'not the same' },
      { sender: 'Jinny', body: 'i-' },
    ],
  },
];

let lives = MAX_LIVES;
let answeredCorrectly = false;
let currentQuestionIndex = 0;

function scrollToCardTop() {
  if (questionCard) {
    questionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function setHash(value = '') {
  const newUrl = `${window.location.pathname}${value ? `#${value}` : ''}`;
  if (window.history?.replaceState) {
    window.history.replaceState(null, '', newUrl);
  } else {
    window.location.hash = value;
  }
}

function updateHashForQuestion(index = currentQuestionIndex) {
  const hashValue = `${HASH_PREFIX}${index + 1}`;
  setHash(hashValue);
}

function getHashQuestionIndex() {
  const hash = window.location.hash.toLowerCase();
  const match = hash.match(new RegExp(`#${HASH_PREFIX}(\\d+)`));
  if (match) {
    const idx = Number.parseInt(match[1], 10) - 1;
    if (Number.isInteger(idx) && idx >= 0 && idx < questions.length) {
      return idx;
    }
  }
  return null;
}

function normalizeAnswer(text) {
  return text.trim().toLowerCase();
}

function updateLivesDisplay() {
  if (!livesDisplay) return;
  const hearts = '❤'.repeat(lives) + '♡'.repeat(MAX_LIVES - lives);
  livesDisplay.textContent = hearts;
  livesDisplay.setAttribute('aria-label', `${lives} lives remaining`);
}

function clearFeedback() {
  if (!feedbackEl) return;
  feedbackEl.textContent = '';
  feedbackEl.classList.remove('correct', 'incorrect');
}

function revealHiddenTexts() {
  document.querySelectorAll('[data-original]').forEach((el) => {
    const original = el.getAttribute('data-original');
    if (original) {
      el.textContent = original;
      el.classList.remove('hidden-text');
      el.removeAttribute('data-original');
    }
  });
}

function setFeedback(message, isCorrect, hint) {
  if (!feedbackEl) return;
  feedbackEl.textContent = message || '';
  feedbackEl.classList.toggle('correct', Boolean(isCorrect));
  feedbackEl.classList.toggle('incorrect', !isCorrect);
  if (!isCorrect && hint) {
    feedbackEl.textContent = `${message} ${hint}`.trim();
  }
}

function disableChoices() {
  if (!choicesList) return;
  choicesList.querySelectorAll('.choice').forEach((btn) => {
    btn.disabled = true;
  });
}

function handleGameOver() {
  disableChoices();
  if (frqInput) {
    frqInput.disabled = true;
  }
  if (restartBtn) {
    restartBtn.hidden = false;
  }
  setFeedback('Game over. Time to start over!', false);
}

function handleCorrect(button) {
  answeredCorrectly = true;
  if (button) {
    button.classList.add('is-correct');
  }
  revealHiddenTexts();
  setFeedback('Correct!', true);

  disableChoices();
  if (frqInput) {
    frqInput.disabled = true;
  }

  if (currentQuestionIndex === questions.length - 1) {
    if (nextBtn) nextBtn.hidden = true;
    questionCard.hidden = true;
    completionCard.hidden = false;
    setHash(COMPLETE_HASH);
    return;
  }

  if (nextBtn) {
    nextBtn.hidden = false;
  }
  if (restartBtn) {
    restartBtn.hidden = true;
  }
}

function handleIncorrect(targetButton, hint) {
  lives -= 1;
  updateLivesDisplay();
  setFeedback(lives > 0 ? 'Not quite! Try again.' : 'Game over. Time to start over!', false, lives > 0 ? hint : undefined);

  if (targetButton) {
    targetButton.disabled = true;
  }

  if (lives <= 0) {
    handleGameOver();
  }
}

function onChoiceClick(event) {
  const button = event.currentTarget;
  const key = button.dataset.choice;
  if (answeredCorrectly || button.disabled) return;

  scrollToCardTop();
  const question = questions[currentQuestionIndex];
  const selected = question.options.find((opt) => opt.key === key);

  if (selected?.correct) {
    handleCorrect(button);
  } else {
    handleIncorrect(button);
  }
}

function setupChoices(question) {
  if (!choicesList) return;
  choicesList.innerHTML = '';
  question.options.forEach((option) => {
    const li = document.createElement('li');
    li.className = 'choice-row';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    btn.dataset.choice = option.key;
    btn.textContent = option.key;
    btn.setAttribute('aria-label', `${option.key}. ${option.text}`);
    btn.addEventListener('click', onChoiceClick);
    const label = document.createElement('span');
    label.className = 'choice__label';
    label.textContent = option.text;
    li.append(btn, label);
    choicesList.appendChild(li);
  });
  choicesList.hidden = false;
}

function setupFrq(question) {
  if (!frqForm || !frqInput) return;
  frqForm.hidden = false;
  frqInput.value = '';
  frqInput.disabled = false;
  frqInput.focus({ preventScroll: true });

  frqForm.onsubmit = (event) => {
    event.preventDefault();
    if (answeredCorrectly || frqInput.disabled) return;

    const guess = normalizeAnswer(frqInput.value);
    const expected = normalizeAnswer(question.answer);

    if (guess === expected) {
      handleCorrect();
    } else {
      handleIncorrect(undefined, question.hint);
    }

    scrollToCardTop();
  };
}

function clearChat() {
  if (chatMessagesEl) {
    chatMessagesEl.innerHTML = '';
  }
}

function classifySender(sender = '') {
  if (sender.toLowerCase().includes('jinny')) return 'jinny';
  return 'phillip';
}

function renderMessages(messages = []) {
  if (!chatMessagesEl) return;
  clearChat();
  messages.forEach((msg) => {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${classifySender(msg.sender)}`;

    const senderEl = document.createElement('p');
    senderEl.className = 'message__sender';
    senderEl.textContent = msg.sender;
    wrapper.appendChild(senderEl);

    const bodyEl = document.createElement('p');
    bodyEl.className = 'message__body';
    if (msg.hidden) {
      bodyEl.textContent = '[text hidden]';
      bodyEl.classList.add('hidden-text');
      bodyEl.setAttribute('data-original', msg.body);
    } else {
      bodyEl.textContent = msg.body;
    }
    wrapper.appendChild(bodyEl);

    if (msg.footer) {
      const footerEl = document.createElement('p');
      footerEl.className = 'message__footer';
      footerEl.textContent = msg.footer;
      wrapper.appendChild(footerEl);
    }

    chatMessagesEl.appendChild(wrapper);
  });
}

function renderQuestion() {
  const question = questions[currentQuestionIndex];
  answeredCorrectly = false;
  clearFeedback();

  if (nextBtn) {
    nextBtn.hidden = true;
  }
  if (restartBtn) {
    restartBtn.hidden = true;
  }

  if (questionTitleEl) {
    questionTitleEl.textContent = question.title;
  }
  if (questionSubtitleEl) {
    questionSubtitleEl.textContent = question.subtitle || '';
  }
  if (questionTextEl) {
    questionTextEl.textContent = question.prompt;
  }

  if (chatTimestampEl) {
    chatTimestampEl.textContent = question.timestamp || '';
    chatTimestampEl.hidden = !question.timestamp;
  }

  renderMessages(question.messages);

  if (question.type === 'mcq') {
    if (frqForm && frqInput) {
      frqForm.hidden = true;
      frqInput.value = '';
      frqInput.disabled = false;
      frqForm.onsubmit = null;
    }
    setupChoices(question);
  } else {
    if (choicesList) {
      choicesList.innerHTML = '';
      choicesList.hidden = true;
    }
    setupFrq(question);
  }

  updateHashForQuestion();
  scrollToCardTop();
}

function startGame(startIndex = 0) {
  lives = MAX_LIVES;
  currentQuestionIndex = Math.min(Math.max(startIndex, 0), questions.length - 1);
  answeredCorrectly = false;
  updateLivesDisplay();
  completionCard.hidden = true;
  questionCard.hidden = false;
  clearFeedback();
  if (introSlide) introSlide.hidden = true;
  if (questionSlide) questionSlide.hidden = false;
  renderQuestion();
}

function resetGame() {
  startGame(0);
}

if (nextBtn) {
  nextBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex += 1;
      renderQuestion();
    }
  });
}

if (restartBtn) {
  restartBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetGame();
  });
}

if (proceedBtn && introSlide && questionSlide) {
  proceedBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    startGame(0);
  });
}

const initialHashIndex = getHashQuestionIndex();

if (initialHashIndex !== null) {
  startGame(initialHashIndex);
} else {
  updateLivesDisplay();
}
