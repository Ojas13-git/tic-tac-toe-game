// document.addEventListener("DOMContentLoaded", () => {
//     const gridSizeInput = document.getElementById('grid-size');
//     const winStreakInput = document.getElementById('win-streak');
//     const startGameButton = document.getElementById('start-game');
//     const gameBoard = document.getElementById('game-board');
//     const gameStatus = document.getElementById('game-status');
//     let gridSize = parseInt(gridSizeInput.value);
//     let winStreak = parseInt(winStreakInput.value);
//     let board = [];
//     let currentPlayer = 'X';
//     let gameActive = true;

//     gridSizeInput.addEventListener('input', (e) => {
//         const newSize = parseInt(e.target.value);
//         winStreakInput.max = newSize;
//         if (winStreak > newSize) {
//             winStreak = newSize;
//             winStreakInput.value = newSize;
//         }
//     });

//     startGameButton.addEventListener('click', () => {
//         gridSize = parseInt(gridSizeInput.value);
//         winStreak = parseInt(winStreakInput.value);
//         initGame();
//     });

//     function initGame() {
//         board = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
//         currentPlayer = 'X';
//         gameActive = true;
//         gameStatus.textContent = '';
//         renderBoard();
//     }

//     function renderBoard() {
//         gameBoard.innerHTML = '';
//         gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
//         gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

//         board.forEach((row, rowIndex) => {
//             row.forEach((cell, cellIndex) => {
//                 const cellElement = document.createElement('div');
//                 cellElement.classList.add('cell');
//                 cellElement.textContent = cell;
//                 cellElement.addEventListener('click', () => handleCellClick(rowIndex, cellIndex));
//                 gameBoard.appendChild(cellElement);
//             });
//         });
//     }

//     function handleCellClick(row, col) {
//         if (!gameActive || board[row][col] !== '') return;
//         board[row][col] = currentPlayer;
//         if (checkWin(row, col)) {
//             gameStatus.textContent = `Player ${currentPlayer} wins!`;
//             gameActive = false;
//         } else if (board.flat().every(cell => cell !== '')) {
//             gameStatus.textContent = 'Draw!';
//             gameActive = false;
//         } else {
//             currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
//         }
//         renderBoard();
//     }

//     function checkWin(row, col) {
//         return (
//             checkDirection(row, col, 0, 1) || // Horizontal
//             checkDirection(row, col, 1, 0) || // Vertical
//             checkDirection(row, col, 1, 1) || // Diagonal down-right
//             checkDirection(row, col, 1, -1)   // Diagonal down-left
//         );
//     }

//     function checkDirection(row, col, rowDir, colDir) {
//         let count = 1;
//         for (let i = 1; i < winStreak; i++) {
//             if (board[row + i * rowDir] && board[row + i * rowDir][col + i * colDir] === currentPlayer) {
//                 count++;
//             } else {
//                 break;
//             }
//         }
//         for (let i = 1; i < winStreak; i++) {
//             if (board[row - i * rowDir] && board[row - i * rowDir][col - i * colDir] === currentPlayer) {
//                 count++;
//             } else {
//                 break;
//             }
//         }
//         return count >= winStreak;
//     }

//     // Initialize the game with default settings
//     initGame();
// });


document.addEventListener("DOMContentLoaded", () => {
    const gridSizeInput = document.getElementById('grid-size');
    const winStreakInput = document.getElementById('win-streak');
    const startGameButton = document.getElementById('start-game');
    const restartGameButton = document.getElementById('restart-game');
    const gameBoard = document.getElementById('game-board');
    const gameStatus = document.getElementById('game-status');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const player1ScoreElement = document.getElementById('player1-score');
    const player2ScoreElement = document.getElementById('player2-score');

    let gridSize = parseInt(gridSizeInput.value);
    let winStreak = parseInt(winStreakInput.value);
    let board = [];
    let currentPlayer = 'X';
    let gameActive = true;
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let player1Score = 0;
    let player2Score = 0;

    const clickSound = new Audio('sounds/click.mp3');
    const winSound = new Audio('sounds/win.mp3');

    gridSizeInput.addEventListener('input', (e) => {
        const newSize = parseInt(e.target.value);
        winStreakInput.max = newSize;
        if (winStreak > newSize) {
            winStreak = newSize;
            winStreakInput.value = newSize;
        }
    });

    startGameButton.addEventListener('click', () => {
        gridSize = parseInt(gridSizeInput.value);
        winStreak = parseInt(winStreakInput.value);
        player1Name = player1NameInput.value || 'Player 1';
        player2Name = player2NameInput.value || 'Player 2';
        initGame();
        restartGameButton.style.display = 'block';
    });

    restartGameButton.addEventListener('click', initGame);

    function initGame() {
        board = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
        currentPlayer = 'X';
        gameActive = true;
        gameStatus.textContent = '';
        renderBoard();
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.textContent = cell;
                cellElement.addEventListener('click', () => handleCellClick(rowIndex, cellIndex));
                gameBoard.appendChild(cellElement);
            });
        });
    }

    function handleCellClick(rowIndex, cellIndex) {
        if (board[rowIndex][cellIndex] !== '' || !gameActive) return;
        board[rowIndex][cellIndex] = currentPlayer;
        clickSound.play();
        renderBoard();
        checkGameStatus();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkGameStatus() {
        const win = checkWin();
        const draw = checkDraw();

        if (win) {
            gameActive = false;
            gameStatus.textContent = `${currentPlayer === 'X' ? player1Name : player2Name} wins!`;
            winSound.play();
            if (currentPlayer === 'X') {
                player1Score++;
            } else {
                player2Score++;
            }
            updateScores();
        } else if (draw) {
            gameActive = false;
            gameStatus.textContent = "It's a draw!";
        }
    }

    function checkWin() {
        // Check rows, columns, and diagonals for a win
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j <= gridSize - winStreak; j++) {
                if (board[i].slice(j, j + winStreak).every(cell => cell === currentPlayer)) return true;
                if (board.map(row => row[j]).slice(i, i + winStreak).every(cell => cell === currentPlayer)) return true;
            }
        }

        for (let i = 0; i <= gridSize - winStreak; i++) {
            for (let j = 0; j <= gridSize - winStreak; j++) {
                if (Array.from({ length: winStreak }, (_, k) => board[i + k][j + k]).every(cell => cell === currentPlayer)) return true;
                if (Array.from({ length: winStreak }, (_, k) => board[i + k][j + winStreak - 1 - k]).every(cell => cell === currentPlayer)) return true;
            }
        }

        return false;
    }

    function checkDraw() {
        return board.flat().every(cell => cell !== '');
    }

    function updateScores() {
        player1ScoreElement.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreElement.textContent = `${player2Name}: ${player2Score}`;
    }
});
