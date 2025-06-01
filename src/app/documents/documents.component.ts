import { Component, signal } from '@angular/core';
import { SideBarComponent } from "./side-bar/side-bar.component";
import { FileExplorerComponent } from "./file-explorer/file-explorer.component";

@Component({
  selector: 'app-documents',
  imports: [SideBarComponent, FileExplorerComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
  currentSection = signal('Documents');

  onSectionChange(section: string) {
    this.currentSection.set(section);
  }
}
