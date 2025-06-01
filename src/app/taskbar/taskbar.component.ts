import { Component, inject } from '@angular/core';
import { WindowManagerService } from '../window-manager.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-taskbar',
  imports: [DatePipe],
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.css'
})
export class TaskbarComponent {
  windowsManager = inject(WindowManagerService);
  windows = this.windowsManager.windows;

currentTime = new Date();
  private timeInterval: any;

 ngOnInit() {
    // Update time every second
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
  ngOnDestroy() {
    // Clean up interval to prevent memory leaks
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

   // Getter methods for formatted date/time
  get formattedDate(): string {
    const month = this.currentTime.getMonth() + 1; // getMonth() returns 0-11
    const day = this.currentTime.getDate();
    const year = this.currentTime.getFullYear();
    return `${month}/${day}/${year}`;
  }

   get formattedTime(): string {
    return this.currentTime.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
