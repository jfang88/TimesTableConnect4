document.addEventListener('DOMContentLoaded', () => {
    const instructionsDiv = document.getElementById('instructions');
    const nameEntryDiv = document.getElementById('nameEntry');
    const gameBoardContainer = document.getElementById('gameBoardContainer');
    const gameBoardDiv = document.getElementById('gameBoard');
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const submitAnswerButton = document.getElementById('submitAnswer');
    const messageElement = document.getElementById('message');
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    const closeInstructionsButton = document.getElementById('closeInstructions');
    const startGameButton = document.getElementById('startGame');

    let board = [];
    let rows = 6;
    let cols = 7;
    let currentPlayer = 1;
    let player1Name = "Player 1";
    let player2Name = "Player 2";
    let gameOver = false;

    let currentQuestion = { num1: 0, num2: 0, correctAnswer: 0 }; // Store the current question

    closeInstructionsButton.addEventListener('click', () => {
        instructionsDiv.style.display = 'none';
        nameEntryDiv.style.display = 'block';
    });

    startGameButton.addEventListener('click', () => {
        player1Name = player1NameInput.value || "Player 1";
        player2Name = player2NameInput.value || "Player 2";
        nameEntryDiv.style.display = 'none';
        gameBoardContainer.style.display = 'block';
        initializeBoard();
    });

    function initializeBoard() {
        board = [];
        for (let r = 0; r < rows; r++) {
            board[r] = [];
            for (let c = 0; c < cols; c++) {
                board[r][c] = 0; // 0 represents an empty cell
            }
        }
        renderBoard();
        currentPlayer = 1;
        gameOver = false;
        messageElement.textContent = `${player1Name}'s turn (Red)`;
        generateQuestion(); // Generate the first question
    }

    function renderBoard() {
        gameBoardDiv.innerHTML = ''; // Clear existing board

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.dataset.row = r;
                tile.dataset.col = c;

                if (board[r][c] === 1) {
                    tile.classList.add('player1');
                } else if (board[r][c] === 2) {
                    tile.classList.add('player2');
                }

                tile.addEventListener('click', handleTileClick);
                gameBoardDiv.appendChild(tile);
            }
        }
    }

    function handleTileClick(event) {
        if (gameOver) return;

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (board[row][col] === 0) { // Only allow click on empty tiles
            askQuestion(row, col);
        } else {
            messageElement.textContent = "That tile is already taken.";
        }
    }

    function generateQuestion() {
        currentQuestion.num1 = Math.floor(Math.random() * 12) + 1;
        currentQuestion.num2 = Math.floor(Math.random() * 12) + 1;
        currentQuestion.correctAnswer = currentQuestion.num1 * currentQuestion.num2;
        questionElement.textContent = `What is ${currentQuestion.num1} x ${currentQuestion.num2}?`;
    }

    function askQuestion(row, col) {

        submitAnswerButton.onclick = () => {
            const userAnswer = parseInt(answerInput.value);
            answerInput.value = ""; // Clear the input

            if (userAnswer === currentQuestion.correctAnswer) {
                placeTile(row, col);
                generateQuestion(); // New question after correct answer
            } else {
                messageElement.textContent = "Incorrect! Other player's turn.";
                switchPlayer();
                // If the other player already answered wrong on this question.
                submitAnswerButton.onclick = () => {
                  generateQuestion(); // new question after both players are wrong
                }

            }
        };
    }

    function placeTile(row, col) {
        // Find the lowest available row in the selected column
        let availableRow = -1;
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][col] === 0) {
                availableRow = r;
                break;
            }
        }

        if (availableRow !== -1) {
            board[availableRow][col] = currentPlayer;
            renderBoard();
            if (checkWin(availableRow, col)) {
                gameOver = true;
                messageElement.textContent = `${currentPlayer === 1 ? player1Name : player2Name} wins!`;
            } else {
                switchPlayer();
            }
        } else {
            messageElement.textContent = "Column is full!";
        }
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        messageElement.textContent = `${currentPlayer === 1 ? player1Name : player2Name}'s turn (${currentPlayer === 1 ? 'Red' : 'Blue'})`;
    }

    function checkWin(row, col) {
        // Check horizontal
        let count = 0;
        for (let c = 0; c < cols; c++) {
            if (board[row][c] === currentPlayer) {
                count++;
                if (count === 4) return true;
            } else {
                count = 0;
            }
        }

        // Check vertical
        count = 0;
        for (let r = 0; r < rows; r++) {
            if (board[r][col] === currentPlayer) {
                count++;
                if (count === 4) return true;
            } else {
                count = 0;
            }
        }

        // Check diagonally (top-left to bottom-right)
        count = 0;
        let startRow = row - Math.min(row, col);
        let startCol = col - Math.min(row, col);
        for (let r = startRow, c = startCol; r < rows && c < cols; r++, c++) {
            if (board[r][c] === currentPlayer) {
                count++;
                if (count === 4) return true;
            } else {
                count = 0;
            }
        }

        // Check diagonally (top-right to bottom-left)
        count = 0;
        startRow = row - Math.min(row, cols - 1 - col);
        startCol = col + Math.min(row, cols - 1 - col);
        for (let r = startRow, c = startCol; r < rows && c >= 0; r++, c--) {
            if (board[r][c] === currentPlayer) {
                count++;
                if (count === 4) return true;
            } else {
                count = 0;
            }
        }

        return false;
    }

});