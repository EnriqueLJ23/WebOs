import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { TasksService } from './tasks.service';
import { NewTaskData, Task } from './task.model';
import { NewTaskComponent } from "./new-task/new-task.component";

@Component({
  selector: 'app-tasks',
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  isLoading = signal(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);
    showNewTaskForm = signal(false);
  tasksService = inject(TasksService);
  tasks = this.tasksService.allTasks;
 @ViewChild(NewTaskComponent) newTaskDialog!: NewTaskComponent;

 toggleNewTaskForm() {
    this.showNewTaskForm.set(!this.showNewTaskForm());
  }

  closeNewTaskForm() {
    this.showNewTaskForm.set(false);
  }

 
   onTaskCreated(newTask: NewTaskData) {
    // Assuming addTask handles setting local storage
    this.tasksService.addTask(
      {
        title: newTask.title,
        summary: newTask.summary,
        date: newTask.date,
        priority: newTask.priority,
        status: newTask.status
      },
      "newTask.userId"
    );
  }

  deleteTask(task: Task) {
    this.tasksService.removeTask(task.id);
  }

  editTask(task: Task) {
    // Open edit dialog with task pre-filled
    console.log('Editing task', task);
  }

  getPendingCount(): number {
    return this.tasks().filter(t => t.status === 'pending').length;
  }

  getInProgressCount(): number {
    return this.tasks().filter(t => t.status === 'in-progress' || t.status === 'progress').length;
  }

  getCompletedCount(): number {
    return this.tasks().filter(t => t.status === 'completed').length;
  }
}
