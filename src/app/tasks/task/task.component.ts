import { Component, input, output } from '@angular/core';
import { Task } from '../task.model';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  task = input.required<Task>();
  deleteTask = output<Task>();
  editTask = output<Task>();
  toggleTaskComplete = output<Task>();

  onDelete() {
    this.deleteTask.emit(this.task());
  }

  onEdit() {
    this.editTask.emit(this.task());
  }

  toggleComplete() {
    const updatedTask: Task = { 
      ...this.task(), 
      status: this.task().status === 'completed' ? 'pending' : 'completed' 
    };
    this.toggleTaskComplete.emit(updatedTask);
  }

  isOverdue(): boolean {
    const dueDate = new Date(this.task().dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && this.task().status !== 'completed';
  }

  isDueSoon(): boolean {
    const dueDate = new Date(this.task().dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    return dueDate <= threeDaysFromNow && dueDate >= today && !this.isOverdue();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    
    // Reset time for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  }

  getStatusText(): string {
    switch (this.task().status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
      case 'progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return this.task().status;
    }
  }
}