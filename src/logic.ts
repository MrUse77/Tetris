//IMPORTS
import PiezaTetris from "./piezas/piezas";
import { resetScore, setScore, sumRows, nextPiece } from "./side";
import {
  PIECES,
  colors,
  controlls,
  pieza,
  BLOCK_SIZE,
  BOARD_HEIGHT,
  BOARD_WIDTH,
} from "./utils/consts";
import { audio } from "./utils/utils";
//VARIABLES
const canvas = document.getElementById("tetris") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);
const start = document.querySelector<HTMLDivElement>("#start")!;
const startDiv = document.querySelector<HTMLDivElement>("#start-div")!;
let sigPieza: PiezaTetris;
let sigPieza2: boolean = false;
let dropCounter = 0;
const dropInterval = 500; // Time interval in milliseconds
let lastTime = 0;
let unpaused: boolean = true;
//CANVAS
canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
context.scale(BLOCK_SIZE, BLOCK_SIZE);
//FUNCIONES
function createBoard(width: number, height: number) {
  const board = [];
  while (height--) {
    board.push(new Array(width).fill(0));
  }
  return board;
}
function drawPieza(pieza: PiezaTetris) {
  pieza.forma.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = pieza.color;
        context.fillRect(x + pieza.Position.x, y + pieza.Position.y, 1, 1);
        context.strokeStyle = "black";
        context.strokeRect(x + pieza.Position.x, y + pieza.Position.y, 1, 1);
        context.lineWidth = 0.1;
      }
    });
  });
  if (!sigPieza2) {
    sigPieza = nextPiece(PIECES, colors);
    sigPieza2 = true;
  }
}

function update(time: number = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (unpaused) {
    if (dropCounter > dropInterval) {
      pieza.Position.y++;
      if (checkCollision(pieza)) {
        pieza.Position.y--;
        solidify(pieza);
        removeRows();
      }
      dropCounter = 0;
    }
    drawBoard();
  } else {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.font = "2px Arial";
    context.fillText("PAUSED", 3, 15, canvas.width);
  }
  window.requestAnimationFrame(update);
}

function drawBoard() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = value.color;
        context.fillRect(x, y, 1, 1);
        context.strokeStyle = "black";
        context.strokeRect(x, y, 1, 1);
        context.lineWidth = 0.1;
      }
    });
  });
  drawPieza(pieza);
}
//controlls
document.addEventListener("keydown", (event) => {
  if (event.key === controlls.left) {
    pieza.Position.x--;
    if (checkCollision(pieza)) {
      pieza.Position.x++;
    }
  } else if (event.key === controlls.right) {
    pieza.Position.x++;
    if (checkCollision(pieza)) {
      pieza.Position.x--;
    }
  } else if (event.key === controlls.down) {
    pieza.Position.y++;
    if (checkCollision(pieza)) {
      pieza.Position.y--;
      solidify(pieza);
      removeRows();
    }
  }
  if (event.key === controlls.rotate) {
    rotate(pieza);
  }
});

function checkCollision(pieza: PiezaTetris) {
  return pieza.forma.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && board[y + pieza.Position.y]?.[x + pieza.Position.x] !== 0
      );
    });
  });
}

function solidify(pieza: PiezaTetris) {
  pieza.forma.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[y + pieza.Position.y][x + pieza.Position.x] = {
          value,
          color: pieza.color,
        };
      }
    });
  });
  pieza.Position.y = sigPieza.Position.y;
  pieza.Position.x = sigPieza.Position.x;
  pieza.forma = sigPieza.forma;
  pieza.color = sigPieza.color;

  sigPieza2 = false;
  setScore();
  //death
  if (checkCollision(pieza)) {
    board.forEach((row) => row.fill({ value: 8, color: "black" }));
    audio.pause();
    alert("GAME OVER");
    resetScore();
    board.forEach((row) => row.fill(0));
  }
}

function removeRows() {
  const rowsToRemove: Array<number> = [];
  board.forEach((row, y) => {
    if (row.every((value) => value !== 0)) {
      rowsToRemove.push(y);
    }
  });
  rowsToRemove.forEach((rowIndex) => {
    board.splice(rowIndex, 1);
    board.unshift(new Array(BOARD_WIDTH).fill(0));
  });
  sumRows(rowsToRemove.length);
}
//rotations
function rotate(pieza: PiezaTetris) {
  let rotatedPieza: PiezaTetris["forma"] = [];
  if (pieza.forma === PIECES[5]) {
    rotatedPieza = PIECES[6];
  } else if (pieza.forma === PIECES[6]) {
    rotatedPieza = PIECES[5];
  } else {
    rotatedPieza = pieza.forma.map((_, index) =>
      pieza.forma.map((column) => column[index]).reverse()
    );
  }
  pieza.forma = rotatedPieza;
  if (checkCollision(pieza)) {
    if (pieza.forma === PIECES[5]) {
      rotatedPieza = PIECES[6];
    } else if (pieza.forma === PIECES[6]) {
      rotatedPieza = PIECES[5];
    } else {
      rotatedPieza = pieza.forma.map((_, index) =>
        pieza.forma.map((column) => column[index])
      );
    }
  }
  // fix rotation
  const pos = pieza.Position.x;
  let offset = 1;
  while (checkCollision(pieza)) {
    pieza.Position.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > pieza.forma[0].length) {
      if (pieza.forma === PIECES[5]) {
        pieza.Position.x = pos - 2;
        rotate(pieza);
      } else if (pieza.forma !== PIECES[6]) {
        pieza.Position.x = pos;
        rotate(pieza);
      }
      return;
    }
  }
}
//pause

document.addEventListener("keydown", (event) => {
  if (event.key === controlls.pause) {
    unpaused = !unpaused;
    console.log(unpaused);
  }
});
//start
start.addEventListener("click", () => {
  update();
  startDiv.remove();

  audio.play();
  audio.loop = true;
});
