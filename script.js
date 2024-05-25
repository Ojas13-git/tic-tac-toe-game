document.addEventListener("DOMContentLoaded", () => {
    const startGameButton = document.getElementById('start-game');
    const restartGameButton = document.getElementById('restart-game');
    const gameBoard = document.getElementById('game-board');
    const gameStatus = document.getElementById('game-status');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const player1ScoreElement = document.getElementById('player1-score');
    const player2ScoreElement = document.getElementById('player2-score');

    let board = [];
    let currentPlayer = 'X';
    let gameActive = true;
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let player1Score = 0;
    let player2Score = 0;

    const clickSound = new Audio('sounds/click.mp3');
    const winSound = new Audio('sounds/win.mp3');

    startGameButton.addEventListener('click', () => {
        player1Name = player1NameInput.value || 'Player 1';
        player2Name = player2NameInput.value || 'Player 2';
        initGame();
        restartGameButton.style.display = 'block';
    });

    restartGameButton.addEventListener('click', initGame);

    function initGame() {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        currentPlayer = 'X';
        gameActive = true;
        gameStatus.textContent = '';
        renderBoard();
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(3, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(3, 1fr)`;

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
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === currentPlayer && board[i][1] === currentPlayer && board[i][2] === currentPlayer) return true;
            if (board[0][i] === currentPlayer && board[1][i] === currentPlayer && board[2][i] === currentPlayer) return true;
        }

        // Check diagonals
        if (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) return true;
        if (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer) return true;

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
