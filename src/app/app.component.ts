import { Component } from '@angular/core';
import {WorldComponent} from "./components/world/world.component";
import {SettingsComponent} from "./components/settings/settings.component";

@Component({
    selector: 'app-root',
    imports: [WorldComponent, SettingsComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {}
