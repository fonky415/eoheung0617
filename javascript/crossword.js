// Crossword puzzle data
const answers = {
    '1': 'MOONLIGHT',
    '2': 'TOM',
    '3': 'PIGEON',
    '4': 'POTATO',
    '5': 'POMPOM',
    '6': 'SUGAR',
    '7': 'EOHEUNG',
    '8': 'SORRY',
    '9': 'KISS',
    '10': 'GELATO',
    '11': 'PANTHEON',
    '12': 'VITAMIN',
    '13': 'IRON',
    '14': 'EARPHONES',
    '15': 'STUPID',
    '16': 'RACHMANINONFF',
    '17': 'GELATO',
    '18': 'FACETIME',
    '19': 'FOUR',
    '20': 'RACHMANINONFF',
    '21': 'IRON',
    '22': 'YO',
    '23': 'FRIENDS',
    '24': 'SLEEP',
    '25': 'STUPID',
    '26': 'CAT',
    '27': 'TURTLENECK',
    '28': 'YO'
};

const clues = {
    across: {
        '2': 'grey and tired',
        '3': 'ultimate distraction',
        '7': 'me',
        '9': 'immediately makes a movie good',
        '10': 'satisfies many cravings simultaneously',
        '12': 'deficiency',
        '13': 'no more mining',
        '14': 'yearly tax',
        '15': '321',
        '20': 'the goat',
        '21': 'no more mining',
        '22': '여보세',
        '27': 'how I met your mother'
    },
    down: {
        '1': '창문을 두드리는 __',
        '4': 'my no. 1 competition',
        '5': 'babe alternative',
        '6': 'no more than 20g',
        '8': 's word',
        '11': 'favorite champ',
        '16': 'the goat',
        '17': 'satisfies many cravings simultaneously',
        '18': 'our greatest enemy',
        '19': 'Let A(1,1,1),B(2,3,1),C(3,1,1). Find the area of the parallelogram formed by vectors AB→ and AC→.',
        '23': 'The f word',
        '24': 'deprivation',
        '25': '321',
        '26': '짠',
        '28': '여보세'
    }
};

// Grid layout - define which cells exist
// Using format: [row, col, clueNumber, direction('a'=across,'d'=down), letterIndex]
const gridData = [
    // Row 0
    [0,12,1,'d',0], [0,14,2,'a',0], [0,15,2,'a',1], [0,16,2,'a',2], [0,18,3,'a',0], [0,19,3,'a',1], [0,20,3,'a',2], [0,21,3,'a',3], [0,22,3,'a',4], [0,23,3,'a',5],
    // Row 1
    [1,4,4,'d',0], [1,12,1,'d',1], [1,14,5,'d',0],
    // Row 2
    [1,4,4,'d',1], [1,12,1,'d',2], [1,14,5,'d',1], [1,16,6,'d',0],
    // Row 3
    [1,4,4,'d',2], [1,12,1,'d',3], [1,14,5,'d',2], [1,16,6,'d',1],
    // Row 4
    [1,0,7,'a',0], [1,1,7,'a',1], [1,2,7,'a',2], [1,3,7,'a',3], [1,4,4,'d',3], [1,5,7,'a',4], [1,6,7,'a',5], [1,7,7,'a',6],
    [1,12,1,'d',4], [1,14,5,'d',3], [1,16,6,'d',2],
    // Row 5
    [2,4,4,'d',4], [2,7,8,'d',0], [2,12,1,'d',5], [2,14,5,'d',4], [2,16,6,'d',3],
    // Row 6
    [3,1,9,'a',0], [3,2,9,'a',1], [3,3,9,'a',2], [3,4,4,'d',5], [3,5,9,'a',3], [3,7,8,'d',1],
    [3,9,10,'a',0], [3,10,10,'a',1], [3,11,10,'a',2], [3,12,1,'d',6], [3,13,10,'a',3], [3,14,10,'a',4], [3,15,10,'a',5],
    [3,17,11,'d',0],
    // Row 7
    [4,7,8,'d',2], [4,12,1,'d',7], [4,17,11,'d',1],
    // Row 8  
    [4,5,12,'a',0], [4,6,12,'a',1], [4,7,8,'d',3], [4,8,12,'a',2], [4,9,12,'a',3], [4,10,12,'a',4], [4,11,12,'a',5], [4,12,12,'a',6],
    [4,15,13,'a',0], [4,16,13,'a',1], [4,17,11,'d',2], [4,18,13,'a',2], [4,19,13,'a',3],
    // Row 9
    [5,7,8,'d',4], [5,12,1,'d',8], [5,14,14,'a',0], [5,15,14,'a',1], [5,16,14,'a',2], [5,17,11,'d',3], [5,18,14,'a',3], [5,19,14,'a',4], [5,20,14,'a',5], [5,21,14,'a',6], [5,22,14,'a',7], [5,23,14,'a',8],
    // Row 10
    [6,9,15,'a',0], [6,10,15,'a',1], [6,11,15,'a',2], [6,12,15,'a',3], [6,13,15,'a',4], [6,14,15,'a',5],
    [6,17,11,'d',4], [6,19,16,'d',0],
    // Row 11
    [7,17,11,'d',5], [7,19,16,'d',1], [7,21,17,'d',0],
    // Row 12
    [8,9,18,'d',0], [8,17,11,'d',6], [8,19,16,'d',2], [8,21,17,'d',1],
    // Row 13
    [9,9,18,'d',1], [9,11,19,'d',0], [9,17,11,'d',7], [9,19,16,'d',3], [9,21,17,'d',2],
    // Row 14
    [10,9,18,'d',2], [10,11,19,'d',1], [10,13,20,'a',0], [10,14,20,'a',1], [10,15,20,'a',2], [10,16,20,'a',3], [10,17,11,'d',8], [10,18,20,'a',4], [10,19,16,'d',4], [10,20,20,'a',5], [10,21,17,'d',3], [10,22,20,'a',6], [10,23,20,'a',7], [10,24,20,'a',8], [10,25,20,'a',9], [10,26,20,'a',10], [10,27,20,'a',11], [10,28,20,'a',12],
    // Row 15
    [11,9,18,'d',3], [11,11,19,'d',2], [11,19,16,'d',5], [11,21,17,'d',4],
    // Row 16
    [12,9,18,'d',4], [12,11,19,'d',3], [12,17,21,'a',0], [12,18,21,'a',1], [12,19,16,'d',6], [12,20,21,'a',2], [12,21,17,'d',5], [12,22,21,'a',3],
    [12,24,22,'a',0], [12,25,22,'a',1], [12,29,26,'d',0],
    // Row 17
    [13,9,18,'d',5], [13,11,23,'d',0], [13,19,16,'d',7], [13,29,26,'d',1],
    // Row 18
    [14,9,18,'d',6], [14,11,23,'d',1], [14,13,24,'d',0], [14,19,16,'d',8], [14,29,26,'d',2],
    // Row 19
    [15,9,18,'d',7], [15,11,23,'d',2], [15,13,24,'d',1], [15,19,16,'d',9],
    // Row 20
    [16,11,23,'d',3], [16,13,24,'d',2], [16,15,25,'d',0], [16,19,16,'d',10],
    // Row 21
    [17,11,23,'d',4], [17,13,24,'d',3], [17,15,25,'d',1], [17,19,16,'d',11],
    // Row 22
    [18,6,27,'a',0], [18,7,27,'a',1], [18,8,27,'a',2], [18,9,27,'a',3], [18,10,27,'a',4], [18,11,23,'d',5], [18,12,27,'a',5], [18,13,24,'d',4], [18,14,27,'a',6], [18,15,25,'d',2], [18,16,27,'a',7], [18,17,27,'a',8], [18,18,27,'a',9], [18,19,16,'d',12],
    // Row 23
    [19,11,23,'d',6], [19,15,25,'d',3],
    // Row 24
    [20,15,25,'d',4], [20,17,28,'a',0], [20,18,28,'a',1],
    // Row 25
    [21,15,25,'d',5]
];

let currentWord = null;
let grid = [];
let maxRow = 0;
let maxCol = 0;

// Calculate grid dimensions
gridData.forEach(cell => {
    maxRow = Math.max(maxRow, cell[0]);
    maxCol = Math.max(maxCol, cell[1]);
});

// Create grid
function createGrid() {
    const crossword = document.getElementById('crossword');
    crossword.style.gridTemplateColumns = `repeat(${maxCol + 1}, 32px)`;
    crossword.style.gridTemplateRows = `repeat(${maxRow + 1}, 32px)`;
    
    // Initialize empty grid
    for (let r = 0; r <= maxRow; r++) {
        grid[r] = [];
        for (let c = 0; c <= maxCol; c++) {
            grid[r][c] = null;
        }
    }
    
    // Mark cells that exist
    const clueNumbers = {};
    gridData.forEach(cell => {
        const [row, col, clueNum] = cell;
        grid[row][col] = cell;
        if (!clueNumbers[`${row}-${col}`] || clueNumbers[`${row}-${col}`] > clueNum) {
            clueNumbers[`${row}-${col}`] = clueNum;
        }
    });
    
    // Create cells
    for (let r = 0; r <= maxRow; r++) {
        for (let c = 0; c <= maxCol; c++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            
            if (grid[r][c] === null) {
                cellDiv.classList.add('empty');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = r;
                input.dataset.col = c;
                
                input.addEventListener('input', handleInput);
                input.addEventListener('keydown', handleKeydown);
                input.addEventListener('focus', () => handleFocus(r, c));
                
                cellDiv.appendChild(input);
                
                // Add clue number
                const clueKey = `${r}-${c}`;
                if (clueNumbers[clueKey]) {
                    const number = document.createElement('div');
                    number.className = 'cell-number';
                    number.textContent = clueNumbers[clueKey];
                    cellDiv.appendChild(number);
                }
            }
            
            crossword.appendChild(cellDiv);
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
        moveToPrevious(row, col);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveToNext(row, col);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveToPrevious(row, col);
    }
}

function handleFocus(row, col) {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
    const cell = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
    if (cell) cell.parentElement.classList.add('highlight');
}

function moveToNext(row, col) {
    // Find next cell to the right
    for (let c = col + 1; c <= maxCol; c++) {
        if (grid[row][c]) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${c}"]`);
            if (input) {
                input.focus();
                return;
            }
        }
    }
}

function moveToPrevious(row, col) {
    // Find previous cell to the left
    for (let c = col - 1; c >= 0; c--) {
        if (grid[row][c]) {
            const input = document.querySelector(`input[data-row="${row}"][data-col="${c}"]`);
            if (input) {
                input.focus();
                return;
            }
        }
    }
}

function highlightWord(clueNum, direction) {
    currentWord = {clueNum, direction};
    
    document.querySelectorAll('.clue').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
    
    document.querySelector(`[data-clue="${clueNum}-${direction}"]`)?.classList.add('selected');
    
    // Highlight word cells
    const cells = gridData.filter(cell => cell[2] === parseInt(clueNum) && cell[3] === direction[0]);
    cells.forEach(cell => {
        const input = document.querySelector(`input[data-row="${cell[0]}"][data-col="${cell[1]}"]`);
        if (input) input.parentElement.classList.add('highlight');
    });
    
    if (cells.length > 0) {
        const firstCell = cells[0];
        const firstInput = document.querySelector(`input[data-row="${firstCell[0]}"][data-col="${firstCell[1]}"]`);
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
    
    // Check each answer
    for (let clueNum in answers) {
        const answer = answers[clueNum].toUpperCase();
        const cells = gridData.filter(cell => cell[2] === parseInt(clueNum));
        
        cells.forEach(cell => {
            const input = document.querySelector(`input[data-row="${cell[0]}"][data-col="${cell[1]}"]`);
            if (input && input.value) {
                const correctLetter = answer[cell[4]];
                if (input.value.toUpperCase() === correctLetter) {
                    input.parentElement.classList.add('correct');
                } else {
                    input.parentElement.classList.add('incorrect');
                    allCorrect = false;
                }
            }
        });
    }
    
    if (allCorrect) {
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