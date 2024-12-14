import {Drawable} from "../interfaces/drawable.interface";
import { angle, subtract, translate } from "../math/utils";
import { Polygon } from "./polygon";
import { Segment } from "./segment";

interface EnvelopDrawOptions {
  fill?: string;
  stroke?: string;
  lineWidth?: number;
}

export class Envelop implements Drawable {
  polygon!: Polygon;

  constructor(public skeleton: Segment, public width: number, roundness: number = 1) {
    this.polygon = this.generatePolygon(width, roundness);
  }

  draw(ctx: CanvasRenderingContext2D, options?: EnvelopDrawOptions): void {
    this.polygon.draw(ctx, options);
  }

  private generatePolygon(width: number, roundness: number): Polygon {
    const { startPoint, endPoint } = this.skeleton;
    const radius = width / 2;
    const alpha = angle(subtract(startPoint, endPoint));
    const alpha_clock_wise = alpha + Math.PI / 2;
    const alpha_counter_clock_wise = alpha - Math.PI / 2;
    const points = [];
    const step = Math.PI / Math.max(1, roundness);
    const epsilon = step / 2;
    for (let angle = alpha_counter_clock_wise; angle <= alpha_clock_wise + epsilon; angle += step) {
      points.push(translate(startPoint, angle, radius));
    }
    for (let angle = alpha_counter_clock_wise; angle <= alpha_clock_wise + epsilon; angle += step) {
      points.push(translate(endPoint, Math.PI + angle, radius));
    }

    return new Polygon(points)
  }
}
