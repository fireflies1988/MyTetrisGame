const boardCanvas = document.getElementById("gameBoard");
boardCanvas.setAttribute("width", WIDTH);
boardCanvas.setAttribute("height", HEIGHT);
const boardContext = boardCanvas.getContext("2d");
const scoreElement = document.getElementById("score");
const linesElement = document.getElementById("lines");
const levelElement = document.getElementById("level");
const nextCanvas = document.getElementById("next");
const nextContext = nextCanvas.getContext("2d");
const holdCanvas = document.getElementById("hold");
const holdContext = holdCanvas.getContext("2d");



// draw a square
function drawSquare(x, y, color) {
  boardContext.fillStyle = color;
  boardContext.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

  boardContext.strokeStyle = "#262626";
  boardContext.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

// create the board
const board = [];
for (let r = 0; r < ROW; r++) {
  board[r] = [];
  for (let c = 0; c < COLUMN; c++) {
    board[r][c] = VACANT;
  }
}

// draw the board
function drawBoard() {
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COLUMN; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}

drawBoard();
