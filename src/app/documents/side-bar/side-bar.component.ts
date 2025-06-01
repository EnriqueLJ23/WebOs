import { Component, output } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  sections = [
    {
      title: 'Documents',
      icon: 'docu-icon.svg',
    },
    {
      title: 'Music',
      icon: 'music-icon.svg',
    },
    {
      title: 'Videos',
      icon: 'videos-icon.svg',
    },
    {
      title: 'Photos',
      icon: 'photos-icon.svg',
    },
  ];
  
  activeSection = 'Documents';

  sectionSelected = output<string>();

  selectSection(section: string) {
    this.activeSection = section;
    this.sectionSelected.emit(section);
  }
}
