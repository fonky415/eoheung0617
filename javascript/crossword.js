// Answers for checking
const answers = {
    '1-down': 'moonlight',
    '2-across': 'eoheung',
    '3-across': 'stupid',
    '4-down': 'potato',
    '5-down': 'pompom',
    '6-across': 'vitamin',
    '7-across': 'kiss',
    '8-down': 'sorry',
    '9-down': 'facetime',
    '10-down': 'rachmaninonff',
    '11-across': 'gelato',
    '12-across': 'earphones',
    '13-down': 'sleep',
    '14-across': 'turtleneck',
    '15-across': 'stupid',
    '16-down': 'pantheon',
    '17-down': 'gelato',
    '18-across': 'rachmaninonff',
    '19-down': 'four',
    '20-down': 'cat',
    '21-across': 'iron',
    '22-across': 'yo',
    '23-down': 'friends'
};

// Cell positions for each word [row, col]
const wordPositions = {
    '1-down': [[0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0]],
    '2-across': [[1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6]],
    '3-across': [[0,8], [0,9], [0,10], [0,11], [0,12], [0,13]],
    '4-down': [[0,11], [1,11], [2,11], [3,11], [4,11], [5,11]],
    '5-down': [[0,14], [1,14], [2,14], [3,14], [4,14], [5,14]],
    '6-across': [[2,7], [2,8], [2,9], [2,10], [2,11], [2,12], [2,13]],
    '7-across': [[4,0], [4,1], [4,2], [4,3]],
    '8-down': [[4,3], [5,3], [6,3], [7,3], [8,3]],
    '9-down': [[2,8], [3,8], [4,8], [5,8], [6,8], [7,8], [8,8], [9,8]],
    '10-down': [[5,12], [6,12], [7,12], [8,12], [9,12], [10,12], [11,12], [12,12], [13,12], [14,12], [15,12], [16,12], [17,12]],
    '11-across': [[5,5], [5,6], [5,7], [5,8], [5,9], [5,10]],
    '12-across': [[5,11], [5,12], [5,13], [5,14], [5,15], [5,16], [5,17], [5,18], [5,19]],
    '13-down': [[6,4], [7,4], [8,4], [9,4], [10,4]],
    '14-across': [[6,0], [6,1], [6,2], [6,3], [6,4], [6,5], [6,6], [6,7], [6,8], [6,9]],
    '15-across': [[7,5], [7,6], [7,7], [7,8], [7,9], [7,10]],
    '16-down': [[9,7], [10,7], [11,7], [12,7], [13,7], [14,7], [15,7], [16,7]],
    '17-down': [[9,10], [10,10], [11,10], [12,10], [13,10], [14,10]],
    '18-across': [[9,7], [9,8], [9,9], [9,10], [9,11], [9,12], [9,13], [9,14], [9,15], [9,16], [9,17], [9,18], [9,19]],
    '19-down': [[9,18], [10,18], [11,18], [12,18]],
    '20-down': [[11,19], [12,19], [13,19]],
    '21-across': [[11,11], [11,12], [11,13], [11,14]],
    '22-across': [[12,14], [12,15]],
    '23-down': [[12,3], [13,3], [14,3], [15,3], [16,3], [17,3], [18,3]]
};

// Cell numbers
const cellNumbers = {
    '0-0': '1',
    '1-0': '2',
    '0-8': '3',
    '0-11': '4',
    '0-14': '5',
    '2-7': '6',
    '4-0': '7',
    '4-3': '8',
    '2-8': '9',
    '5-12': '10',
    '5-5': '11',
    '5-11': '12',
    '6-4': '13',
    '6-0': '14',
    '7-5': '15',
    '9-7': '16',
    '9-10': '17',
    '9-7': '18',
    '9-18': '19',
    '11-19': '20',
    '11-11': '21',
    '12-14': '22',
    '12-3': '23'
};

let currentWord = null;

// Create the crossword grid - 19 rows x 20 cols based on the image
function createGrid() {
    const crossword = document.getElementById('crossword');
    const rows = 19;
    const cols = 20;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // Check if this cell should be empty (black square)
            let isEmpty = true;
            for (let word in wordPositions) {
                for (let pos of wordPositions[word]) {
                    if (pos[0] === row && pos[1] === col) {
                        isEmpty = false;
                        break;
                    }
                }
                if (!isEmpty) break;
            }
            
            if (isEmpty) {
                cell.classList.add('empty');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = row;
                input.dataset.col = col;
                
                input.addEventListener('input', function(e) {
                    if (e.target.value) {
                        moveToNextCell(row, col);
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && !e.target.value) {
                        moveToPreviousCell(row, col);
                    }
                });
                
                input.addEventListener('focus', function() {
                    document.querySelectorAll('.cell').forEach(c => c.classList.remove('active'));
                    cell.classList.add('active');
                });
                
                cell.appendChild(input);
                
                // Add cell number if applicable
                const key = `${row}-${col}`;
                if (cellNumbers[key]) {
                    const number = document.createElement('div');
                    number.className = 'cell-number';
                    number.textContent = cellNumbers[key];
                    cell.appendChild(number);
                }
            }
            
            crossword.appendChild(cell);
        }
    }
}

function moveToNextCell(row, col) {
    if (currentWord) {
        const positions = wordPositions[currentWord];
        const currentIndex = positions.findIndex(p => p[0] === row && p[1] === col);
        if (currentIndex !== -1 && currentIndex < positions.length - 1) {
            const next = positions[currentIndex + 1];
            const nextInput = document.querySelector(`input[data-row="${next[0]}"][data-col="${next[1]}"]`);
            if (nextInput) nextInput.focus();
        }
    }
}

function moveToPreviousCell(row, col) {
    if (currentWord) {
        const positions = wordPositions[currentWord];
        const currentIndex = positions.findIndex(p => p[0] === row && p[1] === col);
        if (currentIndex > 0) {
            const prev = positions[currentIndex - 1];
            const prevInput = document.querySelector(`input[data-row="${prev[0]}"][data-col="${prev[1]}"]`);
            if (prevInput) prevInput.focus();
        }
    }
}

function highlightWord(word) {
    currentWord = word;
    
    // Remove previous highlights
    document.querySelectorAll('.clue').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('active'));
    
    // Highlight selected clue
    document.querySelector(`[data-word="${word}"]`).classList.add('selected');
    
    // Highlight word cells
    const positions = wordPositions[word];
    positions.forEach(pos => {
        const input = document.querySelector(`input[data-row="${pos[0]}"][data-col="${pos[1]}"]`);
        if (input) {
            input.parentElement.classList.add('active');
        }
    });
    
    // Focus first cell of the word
    if (positions.length > 0) {
        const firstPos = positions[0];
        const firstInput = document.querySelector(`input[data-row="${firstPos[0]}"][data-col="${firstPos[1]}"]`);
        if (firstInput) firstInput.focus();
    }
}

function checkAnswers() {
    let allCorrect = true;
    let hasInput = false;
    let allFilled = true;
    
    for (let word in wordPositions) {
        const positions = wordPositions[word];
        const correctAnswer = answers[word].toUpperCase();
        let userAnswer = '';
        
        positions.forEach(pos => {
            const input = document.querySelector(`input[data-row="${pos[0]}"][data-col="${pos[1]}"]`);
            if (input) {
                const value = input.value.toUpperCase();
                userAnswer += value;
                if (value) hasInput = true;
                else allFilled = false;
            }
        });
        
        if (userAnswer) {
            positions.forEach((pos, index) => {
                const input = document.querySelector(`input[data-row="${pos[0]}"][data-col="${pos[1]}"]`);
                if (input) {
                    const cell = input.parentElement;
                    cell.classList.remove('correct', 'incorrect');
                    
                    if (input.value) {
                        if (input.value.toUpperCase() === correctAnswer[index]) {
                            cell.classList.add('correct');
                        } else {
                            cell.classList.add('incorrect');
                            allCorrect = false;
                        }
                    }
                }
            });
        }
    }
    
    const message = document.getElementById('message');
    if (!hasInput) {
        message.textContent = 'Please fill in some answers first!';
        message.className = 'message error';
    } else if (allCorrect && allFilled) {
        message.textContent = '🎉 Perfect! You did it! The code is: resilient';
        message.className = 'message success';
    } else if (allCorrect && hasInput) {
        message.textContent = '✓ All filled answers are correct! Keep going!';
        message.className = 'message success';
    } else {
        message.textContent = '❌ Some answers are incorrect. Keep trying!';
        message.className = 'message error';
    }
    
    setTimeout(() => {
        document.querySelectorAll('.cell').forEach(c => {
            c.classList.remove('correct', 'incorrect');
        });
    }, 2000);
}

function resetPuzzle() {
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.cell').forEach(c => {
        c.classList.remove('correct', 'incorrect', 'active');
    });
    document.getElementById('message').textContent = '';
    currentWord = null;
}

// Initialize the grid on page load
createGrid();