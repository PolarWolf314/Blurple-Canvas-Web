export interface Point {
  x: number;
  y: number;
}

export const ORIGIN: Point = { x: 0, y: 0 };

/**
 * Subtracts the components of the second point from the first.
 */
export function diffPoints(p1: Point, p2: Point): Point {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

/**
 * Adds the components of the two points together.
 */
export function addPoints(p1: Point, p2: Point): Point {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

/**
 * Divide the components of the point by the scale.
 */
export function scalePoint(p1: Point, scale: number): Point {
  return { x: p1.x / scale, y: p1.y / scale };
}
