// text-editor.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.css'
})
export class TextEditorComponent {
  editorContent: string = '';
  showFileMenu: boolean = false;
  showSaveDialog: boolean = false;
  fileName: string = '';
  savedFiles: string[] = [];

  constructor() {
    this.loadSavedFilesList();
  }

  toggleFileMenu() {
    this.showFileMenu = !this.showFileMenu;
  }

  closeFileMenu() {
    this.showFileMenu = false;
  }

  showSave() {
    this.showSaveDialog = true;
    this.showFileMenu = false;
  }

  saveFile() {
    if (this.fileName.trim()) {
      localStorage.setItem(`textEditor_${this.fileName}`, this.editorContent);
      this.loadSavedFilesList();
      this.closeSaveDialog();
      alert(`File "${this.fileName}" saved successfully!`);
    }
  }

  openFile(filename: string) {
    const content = localStorage.getItem(`textEditor_${filename}`);
    if (content !== null) {
      this.editorContent = content;
      this.showFileMenu = false;
      alert(`File "${filename}" opened successfully!`);
    }
  }

  exportFile() {
    const blob = new Blob([this.editorContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName || 'document.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    this.showFileMenu = false;
  }

  closeSaveDialog() {
    this.showSaveDialog = false;
    this.fileName = '';
  }

  loadSavedFilesList() {
    this.savedFiles = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('textEditor_')) {
        this.savedFiles.push(key.replace('textEditor_', ''));
      }
    }
  }

  execCmd(command: string) {
    document.execCommand(command, false);
  }
}