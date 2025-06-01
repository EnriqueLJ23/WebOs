// window.component.ts
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  Input,
  output,
  Type,
  viewChild,
  ViewChild,
} from '@angular/core';
import { WindowManagerService } from '../window-manager.service';

@Component({
  selector: 'app-window',
  imports: [CdkDrag, CdkDragHandle, CommonModule],
  templateUrl: './window.component.html',
  styleUrl: './window.component.css',
})
export class WindowComponent {
  @Input() componentToRender!: Type<unknown> | null;
  id = input.required<number>();
  title = input.required<string>();
  zIndex = input.required<number>();
  close = output<number>();
  bringToFront = output<number>();
  windowRef = viewChild.required<ElementRef>('windowRef');
  windowsManager = inject(WindowManagerService);

  left = 50;
  top = 50;
  width = 722; // Initial width
  height = 745; // Initial height
  minWidth = 200;
  minHeight = 150;
  

  resizing = false;
  resizeDir: string = '';
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

 @HostListener('mousedown')
onFocus() {
    this.bringToFront.emit(this.id());
}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.resizing) return;

    event.preventDefault();

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    if (this.resizeDir === 'bottom-right') {
      // Calculate new dimensions
      const newWidth = Math.max(this.minWidth, this.startWidth + dx);
      const newHeight = Math.max(this.minHeight, this.startHeight + dy);

      // Update component properties
      this.width = newWidth;
      this.height = newHeight;

      // Apply styles directly for immediate visual feedback
      const el = this.windowRef().nativeElement as HTMLElement;
      el.style.width = `${newWidth}px`;
      el.style.height = `${newHeight}px`;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.resizing) {
      this.resizing = false;
      this.resizeDir = '';

      // Re-enable text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    }
  }

  initResize(event: MouseEvent, direction: string) {
    event.preventDefault();
    event.stopPropagation(); // Prevent triggering drag

    this.resizing = true;
    this.resizeDir = direction;

    // Store initial values
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.width;
    this.startHeight = this.height;

    // Disable text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
  }

  // Optional: Method to programmatically set window size
  setSize(width: number, height: number) {
    this.width = Math.max(this.minWidth, width);
    this.height = Math.max(this.minHeight, height);
  }

  // Optional: Method to get current window size
  getSize() {
    return { width: this.width, height: this.height };
  }

  onClose() {
    this.close.emit(this.id());
  }
}
