import { Component } from '@angular/core';

import { TaskbarComponent } from "./taskbar/taskbar.component";
import { DesktopComponent } from "./desktop/desktop/desktop.component";

@Component({
  selector: 'app-root',
  imports: [ TaskbarComponent, DesktopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mywebsite';
}
