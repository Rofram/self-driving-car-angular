import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export function getNearestPoint(location: Point, points: Point[], threshold: number = Number.MAX_SAFE_INTEGER): Point | null {
  let nearestPoint: Point | null = null;
  let minDistance = Number.MAX_SAFE_INTEGER;
  for (const point of points) {
    const distance = checkDistance(location, point);
    if (distance < minDistance && distance < threshold) {
      minDistance = distance;
      nearestPoint = point;
    }
  }
  return nearestPoint;
}

function checkDistance(location: Point, point: Point): number {
  return Math.hypot(location.x - point.x, location.y - point.y);
}

export function average(point: Point, otherPoint: Point): Point {
  return new Point((point.x + otherPoint.x) / 2, (point.y + otherPoint.y) / 2);
}

export function add(point1: Point, point2: Point): Point {
  return new Point(point1.x + point2.x, point1.y + point2.y);
}

export function subtract(point1: Point, point2: Point): Point {
  return new Point(point1.x - point2.x, point1.y - point2.y);
}

export function divide(point: Point, scalar: number): Point {
  return new Point(point.x / scalar, point.y / scalar);
}

export function scale(point: Point, scalar: number): Point {
  return new Point(point.x * scalar, point.y * scalar);
}

export function translate(location: Point, angle: number, offset: number): Point {
  return new Point(
    location.x + Math.cos(angle) * offset,
    location.y + Math.sin(angle) * offset
  );
}

export function rotate(point: Point, angle: number): Point {
  return new Point(
    Math.cos(angle) * point.x - Math.sin(angle) * point.y,
    Math.sin(angle) * point.x + Math.cos(angle) * point.y
  );
}

export function angle(point: Point): number {
  return Math.atan2(point.y, point.x);
}

export function getIntersection(segment: Segment, otherSegment: Segment) {
  const tTop = (otherSegment.endPoint.x - otherSegment.startPoint.x) * (segment.startPoint.y - otherSegment.startPoint.y) - (otherSegment.endPoint.y - otherSegment.startPoint.y) * (segment.startPoint.x - otherSegment.startPoint.x);
  const uTop = (otherSegment.startPoint.y - segment.startPoint.y) * (segment.startPoint.x - segment.endPoint.x) - (otherSegment.startPoint.x - segment.startPoint.x) * (segment.startPoint.y - segment.endPoint.y);
  const bottom = (otherSegment.endPoint.y - otherSegment.startPoint.y) * (segment.endPoint.x - segment.startPoint.x) - (otherSegment.endPoint.x - otherSegment.startPoint.x) * (segment.endPoint.y - segment.startPoint.y);
  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        point: new Point(
          lerp(segment.startPoint.x, segment.endPoint.x, t),
          lerp(segment.startPoint.y, segment.endPoint.y, t)
        ),
        offset: t
      }
    }
  }
  return null;
}

export function lerp(from: number, to: number, offset: number): number {
  return from + (to - from) * offset
}

export function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return `hsl(${hue}, 100%, 60%)`;
}
