import { Component, EventEmitter, input, output, Output } from '@angular/core';

@Component({
  selector: 'app-desktop-icon',
  imports: [],
  templateUrl: './desktop-icon.component.html',
  styleUrl: './desktop-icon.component.css'
})
export class DesktopIconComponent {
  icon = input.required<{ id: string, label: string, icon: string }>();
  openApp = output<string>();
    
  open() {
    this.openApp.emit(this.icon().id);
  }
}
