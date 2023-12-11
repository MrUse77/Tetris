export interface PiezaTetris {
  forma: number[][];
  color: string;
  Position: { x: number; y: number };
}
export type piezas = Array<Array<number>>;

export default PiezaTetris;
