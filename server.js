const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const path = require('path');

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use(express.static(__dirname));

// Basic route for serving the game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Game state
let games = {};

class TicTacToeGame {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
    }

    makeMove(index) {
        if (this.board[index] === '' && !this.checkWinner()) {
            this.board[index] = this.currentPlayer;
            
            const gameStatus = this.getGameStatus();
            
            if (!gameStatus.isOver) {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                if (this.currentPlayer === 'O') {
                    const computerMoveIndex = this.computerMove();
                    return {
                        ...gameStatus,
                        computerMove: computerMoveIndex
                    };
                }
            }
            
            return gameStatus;
        }
        return null;
    }

    computerMove() {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (!this.checkWinner()) {
                    this.currentPlayer = 'X';
                }
                return i;
            }
        }
        return -1;
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => 
                this.board[index] !== '' && this.board[index] === this.board[pattern[0]]
            )
        );
    }

    getGameStatus() {
        const winner = this.checkWinner();
        const isDraw = !winner && this.board.every(cell => cell !== '');
        
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,
            isOver: winner || isDraw,
            winner: winner ? this.currentPlayer : null,
            isDraw: isDraw
        };
    }

    reset() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        return this.getGameStatus();
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    games[socket.id] = new TicTacToeGame();
    socket.emit('gameState', games[socket.id].getGameStatus());

    socket.on('makeMove', (index) => {
        console.log(`Player ${socket.id} made move at index ${index}`);
        const game = games[socket.id];
        if (game) {
            const result = game.makeMove(index);
            if (result) {
                socket.emit('gameState', result);
                
                if (result.computerMove !== undefined) {
                    setTimeout(() => {
                        socket.emit('gameState', game.getGameStatus());
                    }, 500);
                }
            }
        }
    });

    socket.on('reset', () => {
        console.log(`Game reset by player ${socket.id}`);
        const game = games[socket.id];
        if (game) {
            socket.emit('gameState', game.reset());
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        delete games[socket.id];
    });
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = 3001; // Changed to port 3001

// Function to check if port is in use
const checkPort = (port) => {
    return new Promise((resolve, reject) => {
        const tester = require('net').createServer()
            .once('error', err => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is in use, trying another port`);
                    resolve(false);
                } else {
                    reject(err);
                }
            })
            .once('listening', () => {
                tester.once('close', () => resolve(true))
                    .close();
            })
            .listen(port);
    });
};

// Start server with port checking
const startServer = async () => {
    try {
        const portAvailable = await checkPort(PORT);
        if (!portAvailable) {
            console.error(`Port ${PORT} is not available. Please try a different port.`);
            process.exit(1);
        }

        http.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log('Press Ctrl+C to stop the server');
        });

        http.on('error', (error) => {
            console.error('Server error:', error);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please try a different port.`);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();