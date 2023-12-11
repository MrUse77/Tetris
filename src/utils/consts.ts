import PiezaTetris from "../piezas/piezas";
import { getRandomInt } from "./utils";
import { piezas } from "../piezas/piezas";

export const BLOCK_SIZE: number = 20;
export const BOARD_WIDTH: number = 14;
export const BOARD_HEIGHT: number = 30;

export const controlls = {
  left: "a",
  right: "d",
  down: "s",
  rotate: "w",
  pause: "p",
};

export const colors: Array<string> = [
  "cyan",
  "blue",
  "orange",
  "yellow",
  "green",
  "purple",
  "red",
];
const color: number = getRandomInt(0, 7);
export const PIECES: Array<piezas> = [
  [
    [0, color, 0],
    [color, color, color],
    [0, 0, 0],
  ],
  [
    [color, color],
    [color, color],
  ],
  [
    [0, color, color],
    [color, color, 0],
    [0, 0, 0],
  ],
  [
    [color, color, 0],
    [0, color, color],
    [0, 0, 0],
  ],
  [
    [0, color, 0],
    [0, color, 0],
    [color, color, 0],
  ],
  [
    [0, color, 0],
    [0, color, 0],
    [0, color, 0],
    [0, color, 0],
  ],
  [
    [0, 0, 0, 0],
    [color, color, color, color],
    [0, 0, 0, 0],
  ],
];

export const pieza: PiezaTetris = {
  forma: PIECES[getRandomInt(0, PIECES.length)],
  Position: { x: 5, y: 0 },
  color: colors[getRandomInt(0, colors.length)],
};
