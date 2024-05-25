import { Injectable } from '@angular/core';
import { Graph } from './math/graph';
import { Envelop } from './primitives/envelop';
import { Drawable } from './interfaces/drawable.interface';

@Injectable({
  providedIn: 'root'
})
export class WorldService implements Drawable {
  graph!: Graph;
  roadWidth: number = 100;
  roundness: number = 3;
  envelop: Envelop[] = [];
  canvasCtx!: CanvasRenderingContext2D;

  constructor() { }

  setGraph(graph: Graph) {
    this.graph = graph;
    return this
  }

  setCanvasCtx(canvasCtx: CanvasRenderingContext2D) {
    this.canvasCtx = canvasCtx;
    return this
  }

  setRoadWidth(roadWidth: number) {
    this.roadWidth = roadWidth;
    return this
  }

  setRoundness(roundness: number) {
    this.roundness = roundness;
    return this
  }

  generate() {
    this.envelop.length = 0;
    for (const segment of this.graph.segments) {
      this.envelop.push(new Envelop(segment, this.roadWidth, this.roundness));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const envelop of this.envelop) {
      envelop.draw(ctx);
    }
  }

  display() {
    this.draw(this.canvasCtx);
  }
}
