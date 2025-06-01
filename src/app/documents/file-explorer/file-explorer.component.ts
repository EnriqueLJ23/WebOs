import { Component, input } from '@angular/core';

@Component({
  selector: 'app-file-explorer',
  imports: [],
  templateUrl: './file-explorer.component.html',
  styleUrl: './file-explorer.component.css'
})
export class FileExplorerComponent {
  section = input<string>('Documents');

  getFiles() {
    switch (this.section()){
        case 'Documents':
        return ['Resume.docx', 'Report.pdf', 'Notes.txt'];
      case 'Music':
        return ['Song1.mp3', 'Beats.wav', 'Track.flac'];
      case 'Videos':
        return ['Movie.mp4', 'Clip.mov', 'Demo.avi'];
      case 'Photos':
        return ['Pic1.jpg', 'Image2.png', 'Snap3.webp'];
      default:
        return [];
    }
  }
}
