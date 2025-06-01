import { Injectable, signal } from '@angular/core';

import { type NewTaskData } from './task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasks = signal([
    {
      id: 't1',
      userId: 'u1',
      title: 'Master Angular',
      status: 'pending',
      priority: 'low',
      summary:
        'Learn all the basic and advanced features of Angular & how to apply them.',
      dueDate: '2025-12-31',
    } 
  ]);

  allTasks = this.tasks.asReadonly();

  constructor() {
    const tasks = localStorage.getItem('tasks');

    if (tasks) {
      this.tasks.set(JSON.parse(tasks));
    }
  }

  addTask(taskData: NewTaskData, userId: string) {
    this.tasks.update((prevTasks) => [
      {
        id: new Date().getTime().toString(),
        userId: userId,
        title: taskData.title,
        status: taskData.status,
        summary: taskData.summary,
        priority: taskData.priority,
        dueDate: taskData.date,
      },
      ...prevTasks,
    ]);
    this.saveTasks();
  }

  removeTask(id: string) {
    this.tasks.update((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
    this.saveTasks();
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks()));
  }
}