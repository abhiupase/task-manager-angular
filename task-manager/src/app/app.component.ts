import { Component, OnInit, inject } from '@angular/core';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskBoardComponent, TaskFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private taskService = inject(TaskService);

  progress = this.taskService.progressPercent;
  total = this.taskService.totalCount;
  done = this.taskService.doneCount;

  ngOnInit(): void {
    this.taskService.fetchTasks();
  }

  onTaskCreated(): void {
    // Signals already update the board reactively — nothing to wire manually.
  }
}
