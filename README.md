# Tic Tac Toe Game

A real-time Tic Tac Toe game implementation using Node.js, Express, and Socket.IO. Play against a computer opponent in this classic game!

## Features

- Real-time gameplay using Socket.IO
- Single-player mode against computer opponent
- Clean and responsive user interface
- Automatic port availability checking
- Error handling and logging
- Game state management

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd tic-tac-toe-game
```

2. Install dependencies:
```bash
npm install
```

## Running the Game

1. Start the server:
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3001
```

## Game Rules

1. The game is played on a 3x3 grid
2. You are X, and the computer is O
3. Players take turns putting their marks in empty squares
4. The first player to get 3 marks in a row (horizontally, vertically, or diagonally) wins
5. When all squares are full and no player has won, the game is a draw

## Technical Stack

- **Backend:**
  - Node.js
  - Express.js
  - Socket.IO

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript
  - Socket.IO Client

## Project Structure

- `server.js` - Main server file with game logic and Socket.IO handling
- `index.html` - Game interface
- `style.css` - Game styling
- `script.js` - Frontend game logic
- `package.json` - Project dependencies and scripts

## Features in Detail

- Real-time updates using WebSocket connection
- Computer opponent with basic AI
- Game state management
- Automatic port checking and error handling
- Responsive design
- Clean and intuitive user interface

## Error Handling

The application includes comprehensive error handling:
- Port availability checking
- Uncaught exception handling
- Unhandled promise rejection handling
- Socket connection error handling

## Development

To run the game in development mode with automatic server restart:
```bash
npm run dev
```

## License

[Add your license here]