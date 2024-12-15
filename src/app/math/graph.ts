import { Drawable } from '../interfaces/drawable.interface';
import { Point } from '../primitives/point';
import { Segment } from '../primitives/segment';

export type GraphLocalState = {
  points: Point[];
  segments: Segment[];
}

export class Graph implements Drawable {

  private constructor(
    public points: Point[] = [],
    public segments: Segment[] = [],
  ) {}

  static create(points: Point[] = [], segments: Segment[] = []) {
    return new Graph(points, segments);
  }

  static load(state: GraphLocalState) {
    const points = state.points.map(point => new Point(point.x, point.y));
    const segments = state.segments.map(segment =>
      new Segment(
        points.find(p => p.equals(segment.startPoint))!,
        points.find(p => p.equals(segment.endPoint))!
      )
    );
    return new Graph(points, segments);
  }

  hash() {
    return JSON.stringify(this);
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const segment of this.segments) {
      segment.draw(ctx);
    }
    for (const point of this.points) {
      point.draw(ctx);
    }
  }

  setPoints(points: Point[]) {
    this.points = points;
  }

  setSegments(segments: Segment[]) {
    this.segments = segments;
  }

  addPoint(point: Point) {
    this.points.push(point);
  }

  addSegment(segment: Segment) {
    this.segments.push(segment);
  }

  getSegmentsWithPoint(point: Point) {
    return this.segments.filter(segment => segment.includes(point));
  }

  removePoint(point: Point) {
    for (const segment of this.getSegmentsWithPoint(point)) {
        this.removeSegment(segment);
    }
    this.points.splice(this.points.indexOf(point), 1);
  }

  removeSegment(segment: Segment) {
    this.segments.splice(this.segments.indexOf(segment), 1);
  }

  containsPoint(point: Point) {
    return this.points.find((p) => p.equals(point))
  }

  containsSegment(segment: Segment) {
    return this.segments.find((s) => s.equals(segment))
  }

  tryAddPoint(point: Point): boolean {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  tryAddSegment(segment: Segment): boolean {
    if (!this.containsSegment(segment) && !segment.startPoint.equals(segment.endPoint)) {
      this.addSegment(segment);
      return true;
    }
    return false;
  }

  dispose() {
    this.points = [];
    this.segments = [];
  }
}
