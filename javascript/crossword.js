// Answers for checking
const answers = {
    '1-down': 'elephant',
    '2-down': 'bat',
    '3-down': 'dog',
    '4-across': 'kangaroo',
    '5-across': 'cat'
};

// Cell positions for each word
const wordPositions = {
    '1-down': [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]],
    '2-down': [[4, 3], [5, 3], [6, 3], [7, 3]],
    '3-down': [[4, 6], [5, 6], [6, 6]],
    '4-across': [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7]],
    '5-across': [[8, 3], [8, 4], [8, 5]]
};

// Cell numbers
const cellNumbers = {
    '0-1': '1',
    '4-3': '2',
    '4-6': '3',
    '5-0': '4',
    '8-3': '5'
};

let currentWord = null;

// Create the crossword grid
function createGrid() {
    const crossword = document.getElementById('crossword');
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 8; col++) {
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
            }
        });
        
        if (userAnswer) {
            const isCorrect = userAnswer === correctAnswer;
            
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
    } else if (allCorrect && hasInput) {
        message.textContent = '🎉 Perfect! All answers are correct!';
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

function revealAnswers() {
    for (let word in wordPositions) {
        const positions = wordPositions[word];
        const answer = answers[word].toUpperCase();
        
        positions.forEach((pos, index) => {
            const input = document.querySelector(`input[data-row="${pos[0]}"][data-col="${pos[1]}"]`);
            if (input) {
                input.value = answer[index];
            }
        });
    }
    
    const message = document.getElementById('message');
    message.textContent = '💡 All answers revealed!';
    message.className = 'message success';
}

// Initialize the grid on page load
createGrid();