document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.getAttribute('data-index');
            if (board[index] === '' && !checkWinner()) {
                board[index] = currentPlayer;
                cell.textContent = currentPlayer;
                if (checkWinner()) {
                    alert(currentPlayer + ' wins!');
                } else if (board.every(cell => cell !== '')) {
                    alert('Draw!');
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    if (currentPlayer === 'O') {
                        computerMove();
                    }
                }
            }
        });
    });

    resetButton.addEventListener('click', resetGame);

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            return pattern.every(index => board[index] === currentPlayer);
        });
    }

    function computerMove() {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer;
                cells[i].textContent = currentPlayer;
                if (checkWinner()) {
                    alert(currentPlayer + ' wins!');
                } else if (board.every(cell => cell !== '')) {
                    alert('Draw!');
                } else {
                    currentPlayer = 'X';
                }
                break;
            }
        }
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
    }
});
