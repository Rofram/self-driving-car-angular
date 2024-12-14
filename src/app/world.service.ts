import { Injectable } from '@angular/core';
import { Graph } from './math/graph';
import { Envelop } from './primitives/envelop';
import { Drawable } from './interfaces/drawable.interface';
import {Polygon} from "./primitives/polygon";
import {Segment} from "./primitives/segment";

@Injectable({
  providedIn: 'root'
})
export class WorldService implements Drawable {
  canvasCtx!: CanvasRenderingContext2D;
  graph!: Graph;
  roadWidth: number = 100;
  roundness: number = 10;
  envelops: Envelop[] = [];
  roadBoundaries: Segment[] = [];

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
    this.envelops.length = 0;
    for (const segment of this.graph.segments) {
      this.envelops.push(new Envelop(segment, this.roadWidth, this.roundness));
    }

    this.roadBoundaries = Polygon.union(this.envelops.map(envelop => envelop.polygon));
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const road of this.envelops) {
      road.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
    }
    for (const streetLane of this.graph.segments) {
      streetLane.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
    }
    for (const roadBoundary of this.roadBoundaries) {
      roadBoundary.draw(ctx, {color: "white", width: 4});
    }
  }

  display() {
    this.generate();
    this.draw(this.canvasCtx);
  }
}
