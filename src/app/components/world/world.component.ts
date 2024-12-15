import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {GraphEditorService} from "../../services/graph-editor.service";
import {ViewportService} from "../../services/viewport.service";
import {WorldService} from "../../services/world.service";

@Component({
  selector: 'app-world',
  imports: [],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss'
})
export class WorldComponent implements OnInit {
  @ViewChild("canvas", { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private readonly graphEditorService: GraphEditorService,
    private readonly viewportService: ViewportService,
    private readonly worldService: WorldService,
  ) { }

  ngOnInit(): void {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    const canvasCtx = this.canvas.nativeElement.getContext("2d")!;
    this.worldService.initialize(canvasCtx);
    this.viewportService.initialize(this.canvas.nativeElement);
    this.graphEditorService.initialize(this.worldService.graph);
    this.animate();
  }

  animate() {
    this.viewportService.display();
    this.worldService.display();
    this.graphEditorService.display();
    requestAnimationFrame(this.animate.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: Event) {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
  }
}
