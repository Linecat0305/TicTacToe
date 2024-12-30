const cells = document.querySelectorAll('.cell');
const gamestatus = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let moveHistory = { X: [], O: [] };

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function updateNextToDisappear() {
    // Reset all cells to white text
    cells.forEach(cell => {
        if (cell.classList.contains('text-red-500')) {
            cell.classList.remove('text-red-500');
            cell.classList.add('text-white');
        }
    });
    
    // Add red text to the next piece that will disappear for each player
    ['X', 'O'].forEach(player => {
        if (moveHistory[player].length === 3) {
            const oldestCell = moveHistory[player][0].cell;
            oldestCell.classList.remove('text-white');
            oldestCell.classList.add('text-red-500');
        }
    });
}

function handleCellClick(e, index) {
    const cell = e.target;
    
    if (cell.textContent !== '' || !gameActive) return;
    
    // Record the move
    moveHistory[currentPlayer].push({ cell, index });
    
    // Remove oldest move if player has made 3 moves
    if (moveHistory[currentPlayer].length > 3) {
        const oldestMove = moveHistory[currentPlayer].shift();
        oldestMove.cell.textContent = '';
        oldestMove.cell.classList.remove('text-red-500');
        oldestMove.cell.classList.add('text-white');
        gameBoard[oldestMove.index] = '';
    }
    
    cell.textContent = currentPlayer;
    gameBoard[index] = currentPlayer;
    
    // Update which pieces will disappear next
    updateNextToDisappear();
    
    if (checkWin()) {
        gamestatus.textContent = `${currentPlayer} 贏了!`;
        gameActive = false;
        return;
    }
    
    if (checkDraw()) {
        gamestatus.textContent = "平手!";
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gamestatus.textContent = `${currentPlayer} 的回合`;
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    // Draw is now only possible if all cells are filled and no win condition
    return gameBoard.every(cell => cell !== '') && !checkWin();
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    moveHistory = { X: [], O: [] };
    gamestatus.textContent = `${currentPlayer} 的回合`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('text-red-500');
        cell.classList.add('text-white');
    });
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', (e) => handleCellClick(e, index));
});

resetBtn.addEventListener('click', resetGame);
