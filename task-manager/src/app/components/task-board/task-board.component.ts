import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../models/task.model';

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'in-progress', label: 'In progress' },
  { status: 'done', label: 'Done' },
];

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css',
})
export class TaskBoardComponent {
  private taskService = inject(TaskService);

  columns = COLUMNS;
  tasks = this.taskService.tasks;
  loading = this.taskService.loading;
  error = this.taskService.error;

  tasksFor(status: TaskStatus): Task[] {
    return this.tasks().filter((t) => t.status === status);
  }

  advance(task: Task): void {
    const next: Record<TaskStatus, TaskStatus> = {
      todo: 'in-progress',
      'in-progress': 'done',
      done: 'done',
    };
    if (task.status !== 'done') {
      this.taskService.setStatus(task.id, next[task.status]).subscribe();
    }
  }

  remove(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe();
  }
}
