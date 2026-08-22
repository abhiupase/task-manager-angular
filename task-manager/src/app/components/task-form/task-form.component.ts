import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { NewTask } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  @Output() created = new EventEmitter<void>();

  submitting = false;

  // Reactive form with validators — mirrors what the JD calls out explicitly.
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    urgency: [0 as NewTask['urgency'], [Validators.required]],
    description: ['', [Validators.maxLength(240)]],
    priority: ['medium' as NewTask['priority'], [Validators.required]],
    dueDate: ['', [Validators.required]],
  });

  get title() {
    return this.form.controls.title;
  }
  get urgency() {
    return this.form.controls.urgency;
  }
  get description() {
    return this.form.controls.description;
  }
  get dueDate() {
    return this.form.controls.dueDate;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const value = this.form.getRawValue();
    const newTask: NewTask = {
      title: value.title,
      urgency: value.urgency,
      description: value.description,
      priority: value.priority,
      dueDate: value.dueDate,
      status: 'todo'      
    };

    this.taskService.createTask(newTask).subscribe({
      next: () => {
        this.submitting = false;
        this.form.reset({ priority: 'medium',urgency: 0 });
        this.created.emit();
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
