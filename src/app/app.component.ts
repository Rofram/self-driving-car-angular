import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GraphEditorService } from './graph-editor.service';
import { Graph } from './math/graph';
import { ViewportService } from './viewport.service';
import { WorldService } from './world.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild("canvas", { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  canvasCtx!: CanvasRenderingContext2D;
  graph = Graph.create()


  constructor(
    private readonly graphEditorService: GraphEditorService,
    private readonly viewportService: ViewportService,
    private readonly worldService: WorldService
  ) { }

  ngOnInit(): void {
    this.canvas.nativeElement.width = 600;
    this.canvas.nativeElement.height = 600;
    this.canvasCtx = this.canvas.nativeElement.getContext("2d")!;
    this.loadLocalGraph();
    this.worldService.setGraph(this.graph).setCanvasCtx(this.canvasCtx);
    this.viewportService.initialize(this.canvas.nativeElement);
    this.graphEditorService.initialize(this.graph);
    this.animate();
  }

  animate() {
    this.viewportService.display();
    this.worldService.display();
    this.graphEditorService.display();
    requestAnimationFrame(this.animate.bind(this));
  }

  save() {
    localStorage.setItem("graph", JSON.stringify(this.graph));
  }

  dispose() {
    this.graphEditorService.dispose();
  }

  loadLocalGraph() {
    const saveGraph = localStorage.getItem("graph");
    if (saveGraph) {
      const graph = JSON.parse(saveGraph);
      this.graph = Graph.load(graph);
    }
  }
}
