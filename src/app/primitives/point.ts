import { Drawable } from "../interfaces/drawable.interface";

type PointDrawOptions = {
  size?: number;
  color?: string;
  outlined?: boolean;
  fill?: boolean;
};

export class Point implements Drawable {
  constructor(public x: number = 0, public y: number = 0) {}

  draw(
    ctx: CanvasRenderingContext2D,
    {
      size = 18,
      color = 'black',
      outlined = false,
      fill = false
    }: PointDrawOptions = {}
  ) {
    const radius = size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (outlined) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (fill) {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(this.x, this.y, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  equals(other: Point) {
    return this.x === other.x && this.y === other.y
  }
}
