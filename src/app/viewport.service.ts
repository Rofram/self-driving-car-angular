import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { MouseButton } from './enums/mouse-button.enum';
import { add, scale, subtract } from './math/utils';
import { Point } from './primitives/point';

type DragState = {
  startPoint: Point;
  endPoint: Point;
  offset: Point;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ViewportService {
  canvas!: HTMLCanvasElement;
  canvasCtx!: CanvasRenderingContext2D;
  zoom = 1;
  offset!: Point;
  dragState: DragState = {
    startPoint: new Point(0, 0),
    endPoint: new Point(0, 0),
    offset: new Point(0, 0),
    active: false
  };
  center!: Point;

  constructor() { }

  initialize(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasCtx = this.canvas.getContext('2d')!;
    this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
    this.offset = scale(this.center, -1);
    this.addEventListeners();
  }

  display() {
    this.canvasCtx.restore();
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasCtx.save();
    this.canvasCtx.translate(this.center.x, this.center.y);
    this.canvasCtx.scale(1 / this.zoom, 1 / this.zoom);
    const offset = this.getCurrentOffset()
    this.canvasCtx.translate(offset.x, offset.y);
  }

  private addEventListeners() {
    fromEvent<WheelEvent>(this.canvas, "mousewheel").subscribe(this.handleMouseWheel.bind(this));
    fromEvent<MouseEvent>(this.canvas, "mousedown").subscribe(this.handleMouseDown.bind(this));
    fromEvent<MouseEvent>(this.canvas, "mouseup").subscribe(this.handleMouseUp.bind(this));
    fromEvent<MouseEvent>(this.canvas, "mousemove").subscribe(this.handleMouseMove.bind(this));
  }

  getMousePoint(event: MouseEvent, subtractDragOffset: boolean = false) {
    const point = new Point(
      (event.offsetX - this.center.x) * this.zoom - this.offset.x,
      (event.offsetY - this.center.y) * this.zoom - this.offset.y
    );
    return subtractDragOffset ? subtract(point, this.dragState.offset) : point;
  }

  getCurrentOffset() {
    return add(this.offset, this.dragState.offset);
  }

  resetDragState() {
    this.dragState = {
      startPoint: new Point(0, 0),
      endPoint: new Point(0, 0),
      offset: new Point(0, 0),
      active: false
    }
  }

  private handleMouseWheel(event: WheelEvent) {
    const direction = Math.sign(event.deltaY);
    const step = 0.1
    this.zoom += direction * step;
    this.zoom = Math.max(1, Math.min(5, this.zoom));
  }

  private handleMouseUp(_: MouseEvent) {
    if (this.dragState.active) {
      this.offset = add(this.offset, this.dragState.offset);
      this.resetDragState();
    }
  }

  private handleMouseDown(event: MouseEvent) {
    if (event.button === MouseButton.MIDDLE) {
      this.dragState.startPoint = this.getMousePoint(event);
      this.dragState.active = true;
    }
  }

  private handleMouseMove(event: MouseEvent) {
    if (this.dragState.active) {
      this.dragState.endPoint = this.getMousePoint(event);
      this.dragState.offset = subtract(this.dragState.endPoint, this.dragState.startPoint);
    }
  }
}
