import {Component, inject} from '@angular/core';
import {WorldService} from "../../services/world.service";
import {GraphEditorService} from "../../services/graph-editor.service";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-settings',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private readonly snackBar = inject(MatSnackBar);

  constructor(
    private readonly worldService: WorldService,
    private readonly graphEditorService: GraphEditorService,
  ) { }

  saveWorld() {
    this.worldService.save();
    this.openSnackBar("World saved");
  }

  resetWorld() {
    this.graphEditorService.dispose();
    this.worldService.save();
    this.openSnackBar("World reset");
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
