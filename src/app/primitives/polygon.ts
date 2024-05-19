import { Drawable } from "../interfaces/drawable.interface";
import { getRandomColor } from "../math/utils";
import { Segment } from "./segment";

export type PolygonDrawOptions = {
  stroke?: string;
  fill?: string;
  lineWidth?: number;
}

export class Polygon implements Drawable {
  segments: Segment[] = [];
  constructor(public points: any[]) {
    this.generateSegments();
  }

  private generateSegments() {
    this.segments = [];
    for (let i = 1; i < this.points.length; i++) {
      this.segments.push(new Segment(this.points[i - 1], this.points[i % this.points.length]));
    }
  }

  draw(ctx: CanvasRenderingContext2D, { stroke = "blue", fill = "rgba(0, 0, 255, 0.3)", lineWidth = 2 }: PolygonDrawOptions = {}): void {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    const [firstPoint, ...otherPoints] = this.points;
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (const point of otherPoints) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  static break(polygon: Polygon, otherPolygon: Polygon) {
    const segments = polygon.segments;
    const otherSegments = otherPolygon.segments;
    for (let i = 0; i < segments.length; i++) {
      for (let j = 0; j < otherSegments.length; j++) {
        const intersection = Segment.intersection(segments[i], otherSegments[j]);
        if (intersection) {
          let aux = segments[i].endPoint;
          segments[i].endPoint = intersection;
          segments.splice(i + 1, 0, new Segment(intersection, aux));
          aux = otherSegments[j].endPoint;
          otherSegments[j].endPoint = intersection;
          otherSegments.splice(j + 1, 0, new Segment(intersection, aux));
        }
      }
    }
  }

  static multiBreak(polygons: Polygon[]) {
    for (let i = 0; i < polygons.length - 1; i++) {
      for (let j = i + 1; j < polygons.length; j++) {
        Polygon.break(polygons[i], polygons[j]);
      }
    }
  }

  drawSegments(ctx: CanvasRenderingContext2D) {
    for (const segment of this.segments) {
      segment.draw(ctx, { color: getRandomColor(), width: 5 });
    }
  }
}
