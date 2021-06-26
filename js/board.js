const canvas = document.getElementById("gameBoard");
canvas.setAttribute("width", WIDTH);
canvas.setAttribute("height", HEIGHT);
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");


// draw a square
function drawSquare(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

  context.strokeStyle = "black";
  context.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
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
