function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate random number 
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

let score = 0;
let lines = 0;
let level = 1;

let n = -1;
shuffleArray(pieces);

const WALL_KICK1 = [-1, 1, -2, 2];
const WALL_KICK2 = [1, -1, 2, -2];
const BOUNCE_UP = [2, 1, -1, -2];

class Piece {
  constructor(tetromino, name, color) {
    this.tetromino = tetromino;
    this.name = name;
    this.color = color;

    // start from the first pattern
    this.pattern = 0;
    this.activeTetromino = this.tetromino[this.pattern];

    // drop position
    this.x = 3;
    if (this.activeTetromino.length == 4) {
      this.y = -3;
    } else {
      this.y = -2;
    }
  }

  static randomPiece() {
    if (n == pieces.length - 1) {
      n = -1;
      shuffleArray(pieces);
    } 
    n++;
    return new Piece(pieces[n][0], pieces[n][1], pieces[n][2]);
  }

  // just for hold and next canvas
  drawPieceToCanvas(canvas, context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let width, height;
    if (this.name == "I" || this.name == "O") {
      width = height = 4 * SQUARE_SIZE;
    } else {
      width = height = 3 * SQUARE_SIZE;
    }
    let x = canvas.width / 2 - width / 2;
    let y = canvas.height / 2 - height / 2;
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        // draw only occupied squares
        if (this.activeTetromino[r][c]) {
          context.fillStyle = this.color;
          context.fillRect(x + c * SQUARE_SIZE, y + r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

          context.strokeStyle = GRID_LINE_COLOR;
          context.strokeRect(x + c * SQUARE_SIZE, y + r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        }
      }
    }
  }

  drawPiece(x, y, color, borderColor) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        // draw only occupied squares
        if (this.activeTetromino[r][c]) {
          drawSquare(x + c, y + r, color, borderColor);
        }
      }
    }
  }

  // draw the ghost piece
  drawGhostPiece() {
    for (let y = this.y; y < ROW; y++) {
      if (this.ghostPieceCollision(this.x, y, this.activeTetromino)) {
        this.drawPiece(this.x, y - 1, VACANT, this.color);
        break;
      }
    }
  }

  // undraw the ghost piece
  undrawGhostPiece() {
    for (let y = this.y; y < ROW; y++) {
      if (this.ghostPieceCollision(this.x, y, this.activeTetromino)) {
        // just override color
        this.drawPiece(this.x, y - 1, VACANT, VACANT);
        this.drawPiece(this.x, y - 1, VACANT, VACANT);
        this.drawPiece(this.x, y - 1, VACANT, GRID_LINE_COLOR);
        break;
      }
    }
  }

  // draw a piece to the board
  draw() {
    this.drawGhostPiece();
    this.drawPiece(this.x, this.y, this.color, GRID_LINE_COLOR);
  }

  // undraw a piece 
  undraw() {
    this.drawPiece(this.x, this.y, VACANT, GRID_LINE_COLOR);
    this.undrawGhostPiece();
  }


  // move down the piece
  async moveDown() {
    if (moveDownDisabled) {
      return;
    }
    if (this.y == -2 || this.y == -3) {
      if (!this.collides(0, 2, this.activeTetromino)) {
        this.undraw();
        this.y += 2;
        this.draw();
        dropTime = LEVEL[level - 1];
        clearInterval(intervalID2);
        intervalID2 = setInterval(drop, dropTime);
        return;
      }
      dropTime = LEVEL[level - 1];
      clearInterval(intervalID2);
      intervalID2 = setInterval(drop, dropTime);
    }
    if (!this.collides(0, 1, this.activeTetromino)) {
      this.undraw();
      this.y++;
      this.draw();
    } else {
      // lock the piece and generate a new one
      moveDownDisabled = true;
      if (!isHardDrop) {
        await sleep(500);
      }
      if (!this.collides(0, 1, this.activeTetromino)) {
        moveDownDisabled = false;
        return;
      } else {
        if (isHeldOnce) {
          isHeldOnce = false;
        }
        moveDownDisabled = false;
        isHardDrop = false;

        dropTime = 1;
        clearInterval(intervalID2);
        intervalID2 = setInterval(drop, dropTime);

        this.lock();
        p = nextPiece;
        p.draw();
        nextPiece = Piece.randomPiece();
        nextPiece.drawPieceToCanvas(nextCanvas, nextContext);
      }
    }
  }

  // move right the piece
  moveRight() {
    if (!this.collides(1, 0, this.activeTetromino)) {
      this.undraw();
      this.x++;
      this.draw();
    }
  }

  // move left the piece
  moveLeft() {
    if (!this.collides(-1, 0, this.activeTetromino)) {
      this.undraw();
      this.x--;
      this.draw();
    }
  }

  // rotate the piece
  rotateRight() {
    let next = this.tetromino[(this.pattern + 1) % this.tetromino.length];
    let bounce = 0, bounceUp = 0;
    if (this.collides(0, 0, next)) {
      let bounceUpLength = this.name == "I" ? BOUNCE_UP.length : BOUNCE_UP.length - 1;
      let bounceLength = this.name == "I" ? WALL_KICK1.length : WALL_KICK1.length - 2;
      let flag = false;
      for (let i = 0; i < bounceUpLength; i++) {
        for (let j = 0; j < bounceLength; j++) {
          if (!this.collides(WALL_KICK1[j], BOUNCE_UP[i], next)) {
            bounce = WALL_KICK1[j];
            bounceUp = BOUNCE_UP[i];
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }
    }
    if (!this.collides(bounce, bounceUp, next)) {
      this.undraw();
      this.x += bounce;
      this.y += bounceUp;
      this.pattern = (this.pattern + 1) % this.tetromino.length;
      this.activeTetromino = this.tetromino[this.pattern];
      this.draw();
    }
  }
  rotateLeft() {
    let previous = this.tetromino[this.pattern == 0 ? this.tetromino.length - 1 : this.pattern - 1];
    let bounce = 0, bounceUp = 0;
    if (this.collides(0, 0, previous)) {
      let bounceUpLength = this.name == "I" ? BOUNCE_UP.length : BOUNCE_UP.length - 1;
      let bounceLength = this.name == "I" ? WALL_KICK2.length : WALL_KICK2.length - 2;
      let flag = false;
      for (let i = 0; i < bounceUpLength; i++) {
        for (let j = 0; j < bounceLength; j++) {
          if (!this.collides(WALL_KICK2[j], BOUNCE_UP[i], previous)) {
            bounce = WALL_KICK2[j];
            bounceUp = BOUNCE_UP[i];
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }
    }
    if (!this.collides(bounce, bounceUp, previous)) {
      this.undraw();
      this.x += bounce;
      this.y += bounceUp;
      this.pattern = this.pattern == 0 ? this.tetromino.length - 1 : this.pattern - 1;
      this.activeTetromino = this.tetromino[this.pattern];
      this.draw();
    }
  }

  ghostPieceCollision(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece.length; c++) {
        // if the square is empty, skip it
        if (!piece[r][c]) {
          continue;
        }

        // coordinates of the ghost piece after movement
        let newX = c + x;
        let newY = r + y;

        // check if piece reaches the left, right, bottom wall
        if (newX < 0 || newX >= COLUMN || newY >= ROW) {
          return true;
        }

        if (newY < 0) {
          continue;
        }

        // check if there is a locked piece already in place
        if (board[newY][newX] != VACANT) {
          return true;
        }
      }
    }
    return false;
  }

  // detect collisions
  collides(x, y, piece) {
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

        if (newY < 0) {
          continue;
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
    hardDropSound.play();
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        // skip the vacant squares
        if (!this.activeTetromino[r][c]) {
          continue;
        }
        // if the piece locks on the top, game over
        if (this.y + r < 0) {
          clearInterval(intervalID1);
          clearInterval(intervalID2);
          gameoverSound.play();
          showGameOverMenu();
          return;
        }
        // lock the piece
        board[this.y + r][this.x + c] = this.color;
      }
    }

    let counter = 0;
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
        clearLineSound.play();
        // move down all rows above it
        for (let y = r; y >= 1; y--) {
          for (let c = 0; c < COLUMN; c++) {
            board[y][c] = board[y - 1][c];
          }
        }
        // the top row board[0][] has no row above it
        for (let c = 0; c < COLUMN; c++) {
          board[0][c] = VACANT;
        }
        // increase the score
        counter++;
        lines++;
      }
    }

    // calculate score
    if (counter == 1) {
      score += SINGLE_LINE_CLEAR;
    } else if (counter == 2) {
      score += DOUBLE_LINE_CLEAR;
    } else if (counter == 3) {
      score += TRIPLE_LINE_CLEAR;
    } else if (counter == 4) {
      score += TETRIS_LINE_CLEAR;
    }
    
    if (score >= level * BOUND_SCORE && level < 15) {
      level++;
    }

    // update the board
    drawBoard();

    // update the score 
    scoreElement.innerHTML = score;
    linesElement.innerHTML = lines;
    levelElement.innerHTML = level;
  }
}
