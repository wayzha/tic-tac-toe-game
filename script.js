document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3001', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const statusDisplay = document.getElementById('status');

    // Connection status handling
    socket.on('connect', () => {
        console.log('Connected to server');
        statusDisplay.textContent = 'Connected to game server';
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        statusDisplay.textContent = 'Connection error. Trying to reconnect...';
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        statusDisplay.textContent = 'Disconnected from server. Trying to reconnect...';
    });

    // Handle cell clicks
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (socket.connected) {
                const index = parseInt(cell.getAttribute('data-index'));
                socket.emit('makeMove', index);
            }
        });
    });

    // Handle reset button click
    resetButton.addEventListener('click', () => {
        if (socket.connected) {
            socket.emit('reset');
        }
    });

    // Handle game state updates from server
    socket.on('gameState', (gameState) => {
        // Update board
        gameState.board.forEach((value, index) => {
            cells[index].textContent = value;
            cells[index].setAttribute('data-value', value);
        });

        // Update status message
        if (gameState.isOver) {
            if (gameState.winner) {
                statusDisplay.textContent = `Player ${gameState.winner} wins!`;
            } else if (gameState.isDraw) {
                statusDisplay.textContent = "It's a draw!";
            }
        } else {
            statusDisplay.textContent = `Current player: ${gameState.currentPlayer}`;
        }

        // Disable/enable cells based on game state
        cells.forEach((cell, index) => {
            cell.style.cursor = gameState.isOver || gameState.board[index] !== '' ? 'not-allowed' : 'pointer';
        });
    });
});
