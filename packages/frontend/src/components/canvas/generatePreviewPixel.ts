import { RefObject } from "react";

import { Point } from "@blurple-canvas-web/types";

/**
 * Generate a PNG image with a pixel at a specific location.
 * @param canvasRef Reference to the canvas element.
 * @param pixelX X coordinate of the pixel.
 * @param pixelY Y coordinate of the pixel.
 */
export default function updateCanvasPreviewPixel(
  canvasRef: RefObject<HTMLCanvasElement>,
  pixelPoint: Point,
  alpha = 0,
) {
  const context = canvasRef.current?.getContext("2d");
  if (!context) {
    throw new Error("Canvas context is null");
  }

  const { width, height } = context.canvas;

  const { x, y } = pixelPoint;

  // clear the canvas
  context.clearRect(0, 0, width, height);

  // draw a 5x5 white square around the pixel
  context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  context.fillRect(x - 6, y - 6, 13, 13);

  // draw a 3x3 black square around the pixel
  context.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  context.fillRect(x - 3, y - 3, 7, 7);

  // clear quadrants to make a cross
  context.clearRect(x - 6, y - 6, 6, 6);
  context.clearRect(x + 1, y - 6, 6, 6);
  context.clearRect(x - 6, y + 1, 6, 6);
  context.clearRect(x + 1, y + 1, 6, 6);

  context.clearRect(x - 2, y - 2, 5, 5);
}
