import { Drawable } from "../interfaces/drawable.interface";
import { getIntersection } from "../math/utils";
import { Point } from "./point";

type SegmentDrawOptions = {
  width?: number;
  color?: string;
  dash?: [number, number]
}

export class Segment implements Drawable {
  constructor(public startPoint: Point, public endPoint: Point) {}

  equals(other: Segment) {
    return this.includes(other.startPoint) && this.includes(other.endPoint);
  }

  includes(point: Point) {
    return this.startPoint.equals(point) || this.endPoint.equals(point);
  }

  static intersection(polygon: Segment, otherPolygon: Segment) {
    const intersection = getIntersection(
      polygon,
      otherPolygon,
    );
    if (intersection && intersection.offset !== 1 && intersection.offset !== 0) {
      return intersection.point;
    }
    return null;
  }

  draw(ctx: CanvasRenderingContext2D, { width = 2, color = "black", dash = [0, 0] }: SegmentDrawOptions = {}) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dash);
    ctx.moveTo(this.startPoint.x, this.startPoint.y);
    ctx.lineTo(this.endPoint.x, this.endPoint.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
