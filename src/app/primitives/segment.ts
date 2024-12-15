import { Drawable } from "../interfaces/drawable.interface";
import {add, average, dot, getIntersection, magnitude, normalize, scale} from "../math/utils";
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

  get length() {
    return this.startPoint.distanceTo(this.endPoint);
  }

  directionVector() {
    return normalize(this.endPoint.subtract(this.startPoint));
  }

  includes(point: Point) {
    return this.startPoint.equals(point) || this.endPoint.equals(point);
  }

  distanceToPoint(point: Point) {
    const projection = this.projectPoint(point);
    if (projection.offset > 0 && projection.offset < 1) {
      return point.distanceTo(projection.point);
    }
    const startToPoint = point.distanceTo(this.startPoint);
    const endToPoint = point.distanceTo(this.endPoint);
    return Math.min(startToPoint, endToPoint);
  }

  projectPoint(point: Point) {
    const startToPoint = point.subtract(this.startPoint);
    const startToEnd = this.endPoint.subtract(this.startPoint);
    const startToEndNormalized = normalize(startToEnd);
    const scalarProjection = dot(startToPoint, startToEndNormalized);
    const projection = {
      point: add(this.startPoint, scale(startToEndNormalized, scalarProjection)),
      offset: scalarProjection / magnitude(startToEnd),
    }
    return projection;
  }

  get middlePoint() {
    return average(this.startPoint, this.endPoint);
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
