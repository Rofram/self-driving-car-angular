import { Injectable } from '@angular/core';
import { Graph } from './math/graph';
import { Envelop } from './primitives/envelop';
import { Polygon } from './primitives/polygon';

@Injectable({
  providedIn: 'root'
})
export class WorldService {
  graph!: Graph;
  roadWidth: number = 100;
  roundness: number = 3;
  envelops: Envelop[] = [];
  canvasCtx!: CanvasRenderingContext2D;

  constructor() { }

  setGraph(graph: Graph) {
    this.graph = graph;
    return this
  }

  setCanvasCtx(ctx: CanvasRenderingContext2D) {
    this.canvasCtx = ctx;
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
    this.envelops.length = 0;
    for (const segment of this.graph.segments) {
      this.envelops.push(new Envelop(segment, this.roadWidth, this.roundness));
    }

    Polygon.multiBreak(this.envelops.map(e => e.polygon));
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const envelop of this.envelops) {
      envelop.draw(ctx);
    }
  }

  display() {
    this.generate();
    this.draw(this.canvasCtx);
  }
}
