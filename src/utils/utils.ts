export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
export const audio = new Audio("./assets/Tetris.mp3");
audio.volume = 0.1;
