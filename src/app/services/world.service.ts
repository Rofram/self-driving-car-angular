import { Injectable } from '@angular/core';
import {Graph, GraphLocalState} from '../math/graph';
import { Envelop } from '../primitives/envelop';
import { Drawable } from '../interfaces/drawable.interface';
import {Polygon} from "../primitives/polygon";
import {Segment} from "../primitives/segment";
import {STORAGE} from "../constants/storage.constant";
import {add} from "../math/utils";

@Injectable({
  providedIn: 'root'
})
export class WorldService implements Drawable {
  canvasCtx!: CanvasRenderingContext2D;
  graph = Graph.create();
  roadWidth: number = 100;
  roadRoundness: number = 10;
  buildingWidth: number = 150;
  buildingMinLength: number = 150;
  spaceBetweenBuildings: number = 50;
  envelops: Envelop[] = [];
  roadBoundaries: Segment[] = [];
  buildings: Polygon[] = [];
  trees: Polygon[] = [];

  setGraph(graph: Graph) {
    this.graph = graph;
    return this
  }

  initialize(canvasCtx: CanvasRenderingContext2D) {
    this.canvasCtx = canvasCtx;
    this.loadLocalGraph();
    return this
  }

  save() {
    localStorage.setItem(STORAGE.GRAPH, JSON.stringify(this.graph));
  }

  loadLocalGraph() {
    const saveGraph = localStorage.getItem(STORAGE.GRAPH);
    if (saveGraph) {
      const graphState: GraphLocalState = JSON.parse(saveGraph);
      this.graph = Graph.load(graphState);
    }
  }

  setBuildingWidth(buildingWidth: number) {
    this.buildingWidth = buildingWidth;
    return this;
  }

  setBuildingMinLength(buildingMinLength: number) {
    this.buildingMinLength = buildingMinLength;
    return this;
  }

  setSpaceBetweenBuildings(spaceBetweenBuildings: number) {
    this.spaceBetweenBuildings = spaceBetweenBuildings;
    return this;
  }

  setRoadWidth(roadWidth: number) {
    this.roadWidth = roadWidth;
    return this;
  }

  setRoundness(roundness: number) {
    this.roadRoundness = roundness;
    return this;
  }

  private generate() {
    this.envelops.length = 0;
    for (const segment of this.graph.segments) {
      this.envelops.push(new Envelop(segment, this.roadWidth, this.roadRoundness));
    }
    this.roadBoundaries = Polygon.union(this.envelops.map(envelop => envelop.polygon));
    this.buildings = this.generateBuildings();
  }

  private generateBuildings() {
    const tempEnvelops = [];
    for (const segment of this.graph.segments) {
      tempEnvelops.push(
        new Envelop(segment,
          this.roadWidth + this.buildingWidth + this.spaceBetweenBuildings * 2,
          this.roadRoundness
        )
      );
    }

    const guides = Polygon.union(tempEnvelops.map(envelop => envelop.polygon));

    for (let i = 0; i < guides.length; i++) {
      const guide = guides[i];
      if (guide.length < this.buildingMinLength) {
        guides.splice(i, 1);
        i--;
      }
    }

    const supports = [];
    for (const segment of guides) {
      const length = segment.length + this.spaceBetweenBuildings;
      const buildingCount = Math.floor(length / (this.buildingMinLength + this.spaceBetweenBuildings));
      const buildingLength = length / buildingCount - this.spaceBetweenBuildings;
      const direction = segment.directionVector();
      const start = segment.startPoint;
      const end = add(start, direction.scale(buildingLength));
      supports.push(new Segment(start, end));

      for (let i = 1; i < buildingCount; i++) {
        const start = add(segment.startPoint, direction.scale(i * (buildingLength + this.spaceBetweenBuildings)));
        const end = add(start, direction.scale(buildingLength));
        supports.push(new Segment(start, end));
      }
    }

    const buildings = [];
    for (const support of supports) {
      buildings.push(new Envelop(support, this.buildingWidth).polygon);
    }

    for (let i = 0; i < buildings.length - 1; i++) {
      for (let j = i + 1; j < buildings.length; j++) {
        if (Polygon.intersection(buildings[i], buildings[j])) {
          buildings.splice(j, 1);
          j--;
        }
      }
    }
    return buildings;
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
    for (const building of this.buildings) {
      building.draw(ctx);
    }
  }

  display() {
    this.generate();
    this.draw(this.canvasCtx);
  }
}
