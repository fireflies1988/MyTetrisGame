let score = 0;
let lines = 0;
let level = 1;
const keysPressed = {};
const isPressed = {}; // used for making keydown event fired only once
let disabled = false; // disable moveDown() function called by intervalID2
let isHardDrop = false;
let isHoldOnce = false;

scoreElement.innerHTML = score;
linesElement.innerHTML = lines;
levelElement.innerHTML = level;

// initiate a piece
let p = Piece.randomPiece();
p.draw();
let nextPiece = Piece.randomPiece();
nextPiece.drawPieceToNextFrame();
let holdPiece = null;

// control the piece
document.addEventListener("keydown", function(event) {
  if (event.keyCode == 38 || event.keyCode == 90 || event.keyCode == 32 || event.keyCode == 67) {
    if (!isPressed[event.keyCode]) {
      isPressed[event.keyCode] = true;
      keysPressed[event.keyCode] = true;
    }
  } else {
    keysPressed[event.keyCode] = true;
  }
});
document.addEventListener("keyup", function(event) {
  keysPressed[event.keyCode] = false;
  if (event.keyCode == 38 || event.keyCode == 90 || event.keyCode == 32 || event.keyCode == 67) {
    isPressed[event.keyCode] = false;
  }
});

function control() {
  // left arrow
  if (keysPressed[37]) {
    p.moveLeft();
  }
  // right arrow
  if (keysPressed[39]) {
    p.moveRight();
  }
  // up arrow for rotate right
  if (keysPressed[38]) {
    p.rotateRight();
    keysPressed[38] = false;
  }
  // down arrow
  if (keysPressed[40]) {
    p.moveDown();
  }
  // z key for rotate left
  if (keysPressed[90]) {
    p.rotateLeft();
    keysPressed[90] = false;
  }
  // space for hard drop
  if (keysPressed[32]) {
    keysPressed[32] = false;
    clearInterval(intervalID2);
    intervalID2 = setInterval(drop, 1);
    isHardDrop = true;
  }
  // c for hold piece
  if (keysPressed[67]) {
    keysPressed[67] = false;
    if (!isHoldOnce) {
      clearInterval(intervalID2);
      intervalID2 = setInterval(drop, 1);
      p.undraw();
      let temp = holdPiece;
      holdPiece = p;
      // reset pattern
      holdPiece.pattern = 0;
      holdPiece.activeTetromino = holdPiece.tetromino[holdPiece.pattern];
      holdPiece.drawPieceToHoldFrame();
      if (temp == null) {
        p = Piece.randomPiece();
      } else {
        p = temp;
        // reset drop position of holdPiece
        p.x = 3;
        if (p.activeTetromino.length == 4) {
          p.y = -3;
        } else {
          p.y = -2;
        }
      }
      isHoldOnce = true;
    }
  }
}
let intervalID1 = setInterval(control, 70);

// drop the piece every 1 second
function drop() {
    p.moveDown();
}
let intervalID2 = setInterval(drop, 1);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}