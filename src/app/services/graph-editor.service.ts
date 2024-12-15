import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { MOUSE_BUTTON } from '../constants/mouse-buttons.constant';
import { Graph } from '../math/graph';
import { getNearestPoint } from '../math/utils';
import { Point } from '../primitives/point';
import { Segment } from '../primitives/segment';
import { ViewportService } from './viewport.service';

@Injectable({
  providedIn: 'root'
})
export class GraphEditorService {
  graph!: Graph;
  canvas!: HTMLCanvasElement;
  canvasCtx!: CanvasRenderingContext2D;
  selectedPoint: Point | null = null;
  hoveredPoint: Point | null = null;
  isDrawing: boolean = false;
  mousePoint: Point | null = null;

  constructor(private readonly viewportService: ViewportService) {}

  initialize(graph: Graph) {
    this.canvas = this.viewportService.canvas;
    this.graph = graph;
    this.canvasCtx = this.canvas.getContext('2d')!;
    this.addEventListeners();
  }

  display() {
    this.graph.draw(this.canvasCtx);
    if (this.hoveredPoint) {
      this.hoveredPoint.draw(this.canvasCtx, { fill: true });
    }
    if (this.selectedPoint) {
      const intent = this.hoveredPoint ?? this.mousePoint!;
      new Segment(this.selectedPoint, intent).draw(this.canvasCtx, { dash: [3, 3] });
      this.selectedPoint.draw(this.canvasCtx, { outlined: true });
    }
  }

  dispose() {
    this.graph.dispose();
    this.selectedPoint = null;
    this.hoveredPoint = null;
    this.isDrawing = false;
    this.mousePoint = null;
  }

  private addEventListeners() {
    fromEvent<MouseEvent>(this.canvas, "mousedown").subscribe(this.handleMouseDown.bind(this));
    fromEvent<MouseEvent>(this.canvas, "mouseup").subscribe(this.handleMouseUp.bind(this));
    fromEvent<MouseEvent>(this.canvas, "mousemove").subscribe(this.handleMouseMove.bind(this));
    fromEvent(this.canvas, "contextmenu").subscribe((evt) => evt.preventDefault());
  }

  handleMouseDown(event: MouseEvent) {
    if (event.button === MOUSE_BUTTON.RIGHT) {
      if (this.selectedPoint) {
        this.selectedPoint = null;
      } else if (this.hoveredPoint) {
        this.removePoint(this.hoveredPoint);
      }
    }
    if (event.button === MOUSE_BUTTON.LEFT) {
      if (this.hoveredPoint) {
        this.selectPoint(this.hoveredPoint);
        this.isDrawing = true;
        return;
      }
      if (this.mousePoint) {
        this.selectPoint(this.mousePoint);
        this.graph.tryAddPoint(this.mousePoint);
      }
      this.hoveredPoint = this.mousePoint;
    }
  }

  handleMouseUp(_: MouseEvent) {
    this.isDrawing = false;
  }

  handleMouseMove(event: MouseEvent) {
    this.mousePoint = this.viewportService.getMousePoint(event, true);
    this.hoveredPoint = getNearestPoint(this.mousePoint, this.graph.points, 10 * this.viewportService.zoom);
    if (this.isDrawing && this.selectedPoint) {
      this.selectedPoint.x = this.mousePoint.x;
      this.selectedPoint.y = this.mousePoint.y;
    }
  }

  private selectPoint(point: Point) {
    if (this.selectedPoint) {
      this.graph.tryAddSegment(new Segment(this.selectedPoint, point));
    }
    this.selectedPoint = point;
  }

  private removePoint(point: Point) {
    this.graph.removePoint(point);
    this.hoveredPoint = null;
    if (this.selectedPoint === point) {
      this.selectedPoint = null;
    }
  }
}
