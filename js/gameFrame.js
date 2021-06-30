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
const menuElement = document.getElementsByClassName("menu")[0];
const pauseElement = document.getElementById("pauseBtn");
const playElement = document.getElementById("playBtn");
const resumeElement = document.getElementById("resumeBtn");
const quitElement = document.getElementById("quitBtn");
const restartElement = document.getElementById("restartBtn");
const howToPlayElement = document.getElementById("helpBtn");
const settingsBtnElement = document.getElementById("settingsBtn");
const gameOverElement = document.getElementById("gameOver");
const helpElement = document.getElementById("help");
const doneElement = document.getElementById("done");
const settingsMenuElement = document.getElementById("settingsMenu");
const settingsTitleElement = document.getElementById("settingsTitle");
const settingsDoneElement = document.getElementById("settingsDone");
const soundFXElement = document.getElementById("soundFX");

// draw a square
function drawSquare(x, y, color, borderColor) {
  boardContext.fillStyle = color;
  boardContext.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

  boardContext.strokeStyle = borderColor;
  boardContext.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

// create the board
const board = [];
function clearBoard() {
  for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COLUMN; c++) {
      board[r][c] = VACANT;
    }
  }
}

// draw the board
function drawBoard() {
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COLUMN; c++) {
      drawSquare(c, r, board[r][c], GRID_LINE_COLOR);
    }
  }
}

clearBoard();
drawBoard();
