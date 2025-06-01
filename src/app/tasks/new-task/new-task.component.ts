import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { NewTaskData } from '../task.model';

@Component({
  selector: 'app-new-task',
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  close = output<void>();
  tasksService = inject(TasksService);
  destroyRef = inject(DestroyRef);
  taskCreated = output<NewTaskData>();

  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    
    const newTask: NewTaskData = {
      title: formData.value.title,
      summary: formData.value.description,
      status: formData.value.status,
      date: formData.value.date,
      priority: formData.value.priority
    };
    
    this.taskCreated.emit(newTask);
    this.onCancel();
  }

  onCancel() {
    this.close.emit();
  }
}