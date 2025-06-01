import { Component, inject } from '@angular/core';
import { DesktopIconComponent } from "../desktop-icon/desktop-icon.component";
import { WindowComponent } from "../../window/window.component";
import { TaskComponent } from '../../tasks/task/task.component';
import { TasksComponent } from '../../tasks/tasks.component';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { TextEditorComponent } from '../../text-editor/text-editor.component';
import { MusicPlayerComponent } from '../../music-player/music-player.component';
import { WindowManagerService } from '../../window-manager.service';
import { VideoPlayerComponent } from '../../video-player/video-player.component';
import { DocumentsComponent } from '../../documents/documents.component';

@Component({
  selector: 'app-desktop',
  imports: [DesktopIconComponent, WindowComponent, CdkDrag, CdkDropList],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
export class DesktopComponent {
  openWindow = false;
  windowsManager = inject(WindowManagerService);
  windows = this.windowsManager.windows;
  currentComponent = MusicPlayerComponent;
      desktopIcons = [
    { id: 'documents', label: 'Documents', icon: 'documents.svg' },
    { id: 'to-do', label: 'Tasks', icon: 'text-editor.png' },
    { id: 'photos', label: 'Photos', icon: 'photos.svg' },
    { id: 'videos', label: 'Videos', icon: 'video-player.svg' },
    { id: 'player', label: 'Music', icon: 'player.svg' },
    { id: 'text-editor', label: 'Text Editor', icon: 'text-editor.svg' }
  ];

  drop(event: CdkDragDrop<string[]>) {    moveItemInArray(this.desktopIcons, event.previousIndex, event.currentIndex);  }

  onOpenApp(appId: any) {
    if (appId === 'player') {
      this.windowsManager.openWindow('Music Player', MusicPlayerComponent,'documents.svg')
    }
    if (appId === 'text-editor') {
      this.windowsManager.openWindow('Text Editor', TextEditorComponent,'text-editor.svg' )
    }
if (appId === 'to-do') {
      this.windowsManager.openWindow('To DO List', TasksComponent,'text-editor.png')
    }
    if (appId === 'videos') {
      this.windowsManager.openWindow('Video Player', VideoPlayerComponent,'video-player.svg')
    }
     if (appId === 'documents') {
      this.windowsManager.openWindow('File Explorer', DocumentsComponent,'documents.svg')
    }
 
  }

  onCloseWindow(id: number) {
    this.windowsManager.closeWindow(id);
  }

  onBringToFront(id: number) {
    console.log(id);
    
  this.windowsManager.bringToFront(id);
}

}
