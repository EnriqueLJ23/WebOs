import { Injectable, Signal, signal } from '@angular/core';

export interface AppWindow {
  id: number;
  title: string;
  component: any;
  icon: string;
   zIndex: number;
}

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private nextId = 0;
  private zIndexCounter = 100; // starting zIndex
  private _windows = signal<AppWindow[]>([]);
  public windows = this._windows.asReadonly();

  openWindow(title: string, component: any, icon:string) {
    const newWindow: AppWindow = {
      id: ++this.nextId,
      title,
      component,
      icon: icon,
          zIndex: this.zIndexCounter++,
    };

    this._windows.update(windows => [...windows, newWindow]);
  }

  closeWindow(id: number) {
    this._windows.update(windows => windows.filter(w => w.id !== id));
  }

  bringToFront(id: number) {
    this._windows.update(windows =>
      windows.map(win =>
        win.id === id ? { ...win, zIndex: this.zIndexCounter++ } : win
      )
    );
  }
}
