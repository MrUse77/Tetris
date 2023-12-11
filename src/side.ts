import PiezaTetris from "./piezas/piezas";
import { PIECES } from "./utils/consts";
import { piezas } from "./piezas/piezas";

let score = { value: 0 };
function updateScore() {
  document.querySelector<HTMLDivElement>("#side")!.innerHTML = `
  <div id="score"> Score: ${score.value} </div>
`;
}
export function printNextPiece(nextPiece: PiezaTetris) {
  document.querySelector<HTMLDivElement>("#side")!.innerHTML += `
  <canvas id="nextPiece" width="160" height="160"></canvas>
  `;
  const nextPieceCanvas =
    document.querySelector<HTMLCanvasElement>("#nextPiece")!;
  const nextPieceContext = nextPieceCanvas.getContext("2d")!;
  if (nextPiece.forma === PIECES[5] || nextPiece.forma === PIECES[6]) {
    nextPieceCanvas.width = 80;
    nextPieceCanvas.height = 80;
  } else {
    nextPieceCanvas.width = 60;
    nextPieceCanvas.height = 60;
  }
  nextPieceContext.scale(20, 20);
  //cambiar background del canvas

  nextPieceContext.fillStyle = nextPiece.color;
  nextPiece.forma.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        nextPieceContext.fillRect(x, y, 1, 1);
      }
    });
  });
}
export function setScore() {
  score.value++;
  updateScore();
}
export function resetScore() {
  score.value = 0;
  updateScore();
}
export function sumRows(rows: number) {
  score.value += rows * 100;
  updateScore();
}
export function nextPiece(PIECES: Array<piezas>, colors: Array<string>) {
  const nextPiece = {
    forma: PIECES[Math.floor(Math.random() * PIECES.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    Position: { x: Math.floor(Math.random() * 10), y: 0 },
  };
  printNextPiece(nextPiece);
  return nextPiece;
}
function getScore() {
  updateScore();

  return score.value;
}
//acutalizar score.value
getScore();
