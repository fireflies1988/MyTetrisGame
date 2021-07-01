const keysPressed = {};
const isPressed = {}; // used for making keydown event fired only once
let disabled = false; // disable moveDown() function called by intervalID2
let isHardDrop = false;
let isHoldOnce = false;
let dropTime;
let p, nextPiece, holdPiece;
let intervalID1, intervalID2;
let hardDropSound, clearLineSound, rotateSound, gameoverSound, myMusic;

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
    rotateSound.play();
    keysPressed[38] = false;
  }
  // down arrow
  if (keysPressed[40]) {
    p.moveDown();
  }
  // z key for rotate left
  if (keysPressed[90]) {
    p.rotateLeft();
    rotateSound.play();
    keysPressed[90] = false;
  }
  // space for hard drop
  if (keysPressed[32]) {
    if (frameVibrationElement.checked) {
      animate();
    }
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
      holdPiece.drawPieceToCanvas(holdCanvas, holdContext);
      if (temp == null) {
        p = nextPiece;
        nextPiece = Piece.randomPiece();
        nextPiece.drawPieceToCanvas(nextCanvas, nextContext);
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

function resetScore() {
  score = 0;
  lines = 0;
  level = 1;

  scoreElement.innerHTML = score;
  linesElement.innerHTML = lines;
  levelElement.innerHTML = level;
}
resetScore();

// just for hold and next canvas
function clearCanvas(canvas, context) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// drop the piece every 1 second
function drop() {
    p.moveDown();
}

function Sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    if (soundFXElement.checked) {
      this.sound.play();
    }
  }
  this.stop = function() {
    this.sound.pause();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// loading section
loadingSectionElement.addEventListener("animationstart", startLoading);
loadingSectionElement.addEventListener("animationend", endLoading);
function startLoading() {
  mainSectionElement.style.display = "none";
  footerSectionElement.style.display = "none";
}
function endLoading() {
  loadingSectionElement.style.display = "none";
  mainSectionElement.style.display = "block";
  footerSectionElement.style.display = "block";
}

function showPauseMenu() {
  menuElement.style.display = "initial";
  gameOverElement.style.display = "none";
  playElement.style.display = "none";
  resumeElement.style.display = "block";
  quitElement.style.display = "block";
  restartElement.style.display = "block";
  pauseElement.disabled = true;
}

function hidePauseMenu() {
  menuElement.style.display = "none";
  playElement.style.display = "block";
  resumeElement.style.display = "none";
  quitElement.style.display = "none";
  restartElement.style.display = "none";
  pauseElement.disabled = false;
}

function showHomeMenu() {
  menuElement.style.display = "initial";
  gameOverElement.style.display = "none";
  playElement.style.display = "block";
  resumeElement.style.display = "none";
  quitElement.style.display = "none";
  settingsBtnElement.style.display = "block";
  howToPlayElement.style.display = "block";
  restartElement.style.display = "none";
  pauseElement.style.display = "none";
  pauseElement.disabled = false;
}

function showGameOverMenu() {
  menuElement.style.display = "initial";
  gameOverElement.style.display = "block";
  playElement.style.display = "none";
  resumeElement.style.display = "none";
  settingsBtnElement.style.display = "none";
  howToPlayElement.style.display = "none";
  restartElement.style.display = "block";
  quitElement.style.display = "block";
  pauseElement.disabled = true;
}

function play() {
  // initiate a piece
  p = Piece.randomPiece();
  p.draw();
  nextPiece = Piece.randomPiece();
  nextPiece.drawPieceToCanvas(nextCanvas, nextContext);
  holdPiece = null;

  hardDropSound = new Sound("audio/slow-hit.mp3");
  clearLineSound = new Sound("audio/clear-line-speed-1.3x.mp3");
  rotateSound = new Sound("audio/block-rotate.mp3");
  gameoverSound = new Sound("audio/gameover.mp3");

  menuElement.style.display = "none";
  pauseElement.style.display = "initial";
  resumeElement.style.display = "block";
  settingsBtnElement.style.display = "block";
  howToPlayElement.style.display = "block";

  dropTime = 1;
  intervalID1 = setInterval(control, 60);
  intervalID2 = setInterval(drop, dropTime);
}

function pause() {
  clearInterval(intervalID1);
  clearInterval(intervalID2);
  showPauseMenu();
}

function resume() {
  intervalID1 = setInterval(control, 60);
  intervalID2 = setInterval(drop, dropTime);
  hidePauseMenu();
}

function quit() {
  clearCanvas(nextCanvas, nextContext);
  clearCanvas(holdCanvas, holdContext);
  clearInterval(intervalID1);
  clearInterval(intervalID2);
  clearBoard();
  drawBoard();
  showHomeMenu();
  resetScore();
}

function restart() {
  clearCanvas(nextCanvas, nextContext);
  clearCanvas(holdCanvas, holdContext);
  resetScore();
  clearBoard();
  drawBoard();
  clearInterval(intervalID1);
  clearInterval(intervalID2);
  pauseElement.disabled = false;
  play();
}

function setup() {
  menuElement.style.display = "none";
  settingsMenuElement.style.display = "initial";
  settingsTitleElement.style.display = "block";
}

function help() {
  helpElement.style.display = "initial";
}

function done() {
  helpElement.style.display = "none";
}

function doneSetup() {
  settingsMenuElement.style.display = "none";
  settingsTitleElement.style.display = "none";
  menuElement.style.display = "initial";
}

function animate() {
  let pos = 3;
  boardCanvas.style.top = pos + "px";
  let id = setInterval(frame, 5);
  function frame() {
    if (pos == 0) {
      clearInterval(id);
    } else {
      pos--;
      boardCanvas.style.top = pos + "px";
    }
  }
}