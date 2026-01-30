// Crossword puzzle - complete rebuild based on reference image
const GRID_COLS = 30;
const GRID_ROWS = 26;

// Define the exact grid layout - true = cell exists, false = empty space
const gridLayout = [];
for (let i = 0; i < GRID_ROWS; i++) {
    gridLayout[i] = new Array(GRID_COLS).fill(false);
}

// Manually define each word's position based on reference image
const words = [
    // ACROSS WORDS
    { num: 2, dir: 'across', row: 0, col: 14, answer: 'TOM' },
    { num: 3, dir: 'across', row: 0, col: 18, answer: 'PIGEON' },
    { num: 7, dir: 'across', row: 4, col: 0, answer: 'EOHEUNG' },
    { num: 9, dir: 'across', row: 6, col: 1, answer: 'KISS' },
    { num: 10, dir: 'across', row: 6, col: 9, answer: 'GELATO' },
    { num: 12, dir: 'across', row: 8, col: 5, answer: 'VITAMIN' },
    { num: 13, dir: 'across', row: 8, col: 15, answer: 'IRON' },
    { num: 14, dir: 'across', row: 9, col: 14, answer: 'EARPHONES' },
    { num: 15, dir: 'across', row: 10, col: 9, answer: 'STUPID' },
    { num: 20, dir: 'across', row: 14, col: 13, answer: 'RACHMANINONFF' },
    { num: 21, dir: 'across', row: 16, col: 17, answer: 'IRON' },
    { num: 22, dir: 'across', row: 16, col: 24, answer: 'YO' },
    { num: 27, dir: 'across', row: 22, col: 6, answer: 'TURTLENECK' },
    { num: 28, dir: 'across', row: 24, col: 15, answer: 'YO' },
    
    // DOWN WORDS
    { num: 1, dir: 'down', row: 0, col: 12, answer: 'MOONLIGHT' },
    { num: 4, dir: 'down', row: 1, col: 4, answer: 'POTATO' },
    { num: 5, dir: 'down', row: 1, col: 14, answer: 'POMPOM' },
    { num: 6, dir: 'down', row: 2, col: 16, answer: 'SUGAR' },
    { num: 8, dir: 'down', row: 5, col: 7, answer: 'SORRY' },
    { num: 11, dir: 'down', row: 6, col: 17, answer: 'PANTHEON' },
    { num: 16, dir: 'down', row: 7, col: 19, answer: 'RACHMANINONFF' },
    { num: 17, dir: 'down', row: 7, col: 21, answer: 'GELATO' },
    { num: 18, dir: 'down', row: 8, col: 9, answer: 'FACETIME' },
    { num: 19, dir: 'down', row: 9, col: 11, answer: 'FOUR' },
    { num: 23, dir: 'down', row: 13, col: 11, answer: 'FRIENDS' },
    { num: 24, dir: 'down', row: 14, col: 13, answer: 'SLEEP' },
    { num: 25, dir: 'down', row: 16, col: 15, answer: 'STUPID' },
    { num: 26, dir: 'down', row: 16, col: 29, answer: 'CAT' }
];

// Build grid layout from words
words.forEach(word => {
    for (let i = 0; i < word.answer.length; i++) {
        if (word.dir === 'across') {
            gridLayout[word.row][word.col + i] = true;
        } else {
            gridLayout[word.row + i][word.col] = true;
        }
    }
});

// Create cell data structure with answer keys
const cellData = {};
words.forEach(word => {
    for (let i = 0; i < word.answer.length; i++) {
        const row = word.dir === 'across' ? word.row : word.row + i;
        const col = word.dir === 'across' ? word.col + i : word.col;
        const key = `${row}-${col}`;
        
        if (!cellData[key]) {
            cellData[key] = {
                letter: word.answer[i],
                words: [],
                number: null
            };
        }
        cellData[key].words.push({ num: word.num, dir: word.dir, index: i });
        
        // Set clue number for first letter
        if (i === 0) {
            if (cellData[key].number === null || word.num < cellData[key].number) {
                cellData[key].number = word.num;
            }
        }
    }
});

let currentWord = null;

// Create the crossword grid
function createGrid() {
    const crossword = document.getElementById('crossword');
    crossword.style.gridTemplateColumns = `repeat(${GRID_COLS}, 32px)`;
    crossword.style.gridTemplateRows = `repeat(${GRID_ROWS}, 32px)`;
    
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (!gridLayout[row][col]) {
                cell.classList.add('empty');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = row;
                input.dataset.col = col;
                
                input.addEventListener('input', handleInput);
                input.addEventListener('keydown', handleKeydown);
                input.addEventListener('focus', () => handleFocus(row, col));
                
                cell.appendChild(input);
                
                // Add clue number
                const key = `${row}-${col}`;
                if (cellData[key] && cellData[key].number) {
                    const number = document.createElement('div');
                    number.className = 'cell-number';
                    number.textContent = cellData[key].number;
                    cell.appendChild(number);
                }
            }
            
            crossword.appendChild(cell);
        }
    }
}

function handleInput(e) {
    if (e.target.value) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        moveToNext(row, col);
    }
}

function handleKeydown(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    if (e.key === 'Backspace' && !e.target.value) {
        e.preventDefault();
        moveToPrevious(row, col);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveRight(row, col);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveLeft(row, col);
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown(row, col);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveUp(row, col);
    }
}

function handleFocus(row, col) {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
    const cell = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
    if (cell) cell.parentElement.classList.add('highlight');
}

function moveToNext(row, col) {
    if (currentWord && currentWord.dir === 'across') {
        moveRight(row, col);
    } else if (currentWord && currentWord.dir === 'down') {
        moveDown(row, col);
    } else {
        moveRight(row, col);
    }
}

function moveToPrevious(row, col) {
    if (currentWord && currentWord.dir === 'across') {
        moveLeft(row, col);
    } else if (currentWord && currentWord.dir === 'down') {
        moveUp(row, col);
    } else {
        moveLeft(row, col);
    }
}

function moveRight(row, col) {
    for (let c = col + 1; c < GRID_COLS; c++) {
        if (gridLayout[row][c]) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${c}"]`);
            if (input) {
                input.focus();
                return;
            }
        }
    }
}

function moveLeft(row, col) {
    for (let c = col - 1; c >= 0; c--) {
        if (gridLayout[row][c]) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${c}"]`);
            if (input) {
                input.focus();
                return;
            }
        }
    }
}

function moveDown(row, col) {
    for (let r = row + 1; r < GRID_ROWS; r++) {
        if (gridLayout[r][col]) {
            const input = document.querySelector(`input[data-row="${r}"][data-col="${col}"]`);
            if (input) {
                input.focus();
                return;
            }
        }
    }
}

function moveUp(row, col) {
    for (let r = row - 1; r >= 0; r--) {
        if (gridLayout[r][col]) {
            const input = document.querySelector(`input[data-row="${r}"][data-col="${col}"]`);
            if (input) {
                input.focus();
                return;
            }
        }
    }
}

function highlightWord(clueNum, direction) {
    currentWord = { num: parseInt(clueNum), dir: direction };
    
    document.querySelectorAll('.clue').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
    
    document.querySelector(`[data-clue="${clueNum}-${direction}"]`)?.classList.add('selected');
    
    // Find and highlight the word
    const word = words.find(w => w.num === parseInt(clueNum) && w.dir === direction);
    if (word) {
        for (let i = 0; i < word.answer.length; i++) {
            const row = word.dir === 'across' ? word.row : word.row + i;
            const col = word.dir === 'across' ? word.col + i : word.col;
            const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
            if (input) input.parentElement.classList.add('highlight');
        }
        
        // Focus first cell
        const firstInput = document.querySelector(`input[data-row="${word.row}"][data-col="${word.col}"]`);
        if (firstInput) firstInput.focus();
    }
}

function checkAnswers() {
    let allCorrect = true;
    let hasInput = false;
    
    document.querySelectorAll('input').forEach(input => {
        if (input.value) hasInput = true;
        input.parentElement.classList.remove('correct', 'incorrect');
    });
    
    if (!hasInput) {
        showMessage('Please fill in some answers first!', 'error');
        return;
    }
    
    // Check each cell
    Object.keys(cellData).forEach(key => {
        const [row, col] = key.split('-').map(Number);
        const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
        
        if (input && input.value) {
            const correctLetter = cellData[key].letter.toUpperCase();
            if (input.value.toUpperCase() === correctLetter) {
                input.parentElement.classList.add('correct');
            } else {
                input.parentElement.classList.add('incorrect');
                allCorrect = false;
            }
        }
    });
    
    if (allCorrect && hasInput) {
        showMessage('🎉 Perfect! All correct!', 'success');
    } else {
        showMessage('Some answers are incorrect. Keep trying!', 'error');
    }
    
    setTimeout(() => {
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('correct', 'incorrect'));
    }, 2000);
}

function resetPuzzle() {
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('correct', 'incorrect', 'highlight'));
    document.querySelectorAll('.clue').forEach(c => c.classList.remove('selected'));
    showMessage('', '');
    currentWord = null;
}

function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
}

// Initialize
createGrid();