const WIDTH = 200, HEIGHT = WIDTH * 2;
const ROW = 20, COLUMN = 10;
const SQUARE_SIZE = WIDTH / COLUMN;
const VACANT = "white"; // color of an empty square

const canvas = document.getElementById("tetris");
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
let board = [];
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

class Piece {
  constructor(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    // start from the first pattern
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // drop position
    this.x = 3;
    this.y = 0;
  }

  static randomPiece() {
    let random = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[random][0], PIECES[random][1]);
  }

  // draw a piece to the board
  draw() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        // draw only occupied squares
        if (this.activeTetromino[r][c]) {
          drawSquare(this.x + c, this.y + r, this.color);
        }
      }
    }
  }

  // undraw a piece 
  undraw() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        // draw only occupied squares
        if (this.activeTetromino[r][c]) {
          drawSquare(this.x + c, this.y + r, VACANT);
        }
      }
    }
  }

  // move down the piece
  moveDown() {
    if (!this.collision(0, 1, this.activeTetromino)) {
      this.undraw();
      this.y++;
      this.draw();
    } else {
      // lock the piece and generate a new one
      this.lock();
      p = Piece.randomPiece();
      p.draw();
    }
  }

  // move right the piece
  moveRight() {
    if (!this.collision(1, 0, this.activeTetromino)) {
      this.undraw();
      this.x++;
      this.draw();
    }
  }

  // move left the piece
  moveLeft() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
      this.undraw();
      this.x--;
      this.draw();
    }
  }

  // rotate the piece
  rotate() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) {
      if (this.x > COLUMN / 2) {
        kick = -1; // move the piece to the left when colliding with the right wall
      } else {
        kick = 1; // move the piece to the right when colliding with the left wall
      }
    }
    if (!this.collision(kick, 0, nextPattern)) {
      this.undraw();
      this.x += kick;
      this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
      this.activeTetromino = this.tetromino[this.tetrominoN];
      this.draw();
    }
  }

  // detect collisions
  collision(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece.length; c++) {
        // if the square is empty, skip it
        if (!piece[r][c]) {
          continue;
        }

        // coordinates of the piece after movement
        let newX = this.x + c + x;
        let newY = this.y + r + y;

        // check if piece reaches the left, right, bottom wall
        if (newX < 0 || newX >= COLUMN || newY >= ROW) {
          return true;
        }

        // check if there is a locked piece already in place
        if (board[newY][newX] != VACANT) {
          return true;
        }
      }
    }
    return false;
  }

  lock() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        // skip the vacant squares
        if (!this.activeTetromino[r][c]) {
          continue;
        }
        // if the piece locks on the top, game over
        if (this.y + r < 2) {
          clearInterval(intervalID);
          alert("Game over");
          return;
        }
        // lock the piece
        board[this.y + r][this.x + c] = this.color;
      }
    }
    // remove full rows
    for (let r = 0; r < ROW; r++) {
      let isRowFull = true;
      for (let c = 0; c < COLUMN; c++) {
        if (board[r][c] == VACANT) {
          isRowFull = false;
          break;
        }
      }
      if (isRowFull) {
        // move down all rows above it
        for (let y = r; y > 1; y--) {
          for (let c = 0; c < COLUMN; c++) {
            board[y][c] = board[y - 1][c];
          }
        }
        // the top row board[0][] has no row above it
        for (let c = 0; c < COLUMN; c++) {
          board[0][c] = VACANT;
        }
        // increase the score
        score += 10;
      }
    }
    // update the board
    drawBoard();

    // update the score 
    scoreElement.innerHTML = score;
  }
}

// initiate a piece
let p = Piece.randomPiece();
p.draw();
let score = 0;

// control the piece
document.addEventListener("keydown", control);
function control(event) {
  if (event.keyCode == 37) {
    p.moveLeft();
  } else if (event.keyCode == 38) {
    p.rotate();
  } else if (event.keyCode == 39) {
    p.moveRight();
  } else if (event.keyCode == 40) {
    p.moveDown();
  }
}

// drop the piece every 1 second
function drop() {
  p.moveDown();
}
var intervalID = setInterval(drop, 1000);