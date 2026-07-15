import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { NewTask, Task, TaskStatus } from '../models/task.model';

const API_URL = 'http://localhost:3000/tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  // Angular Signals for reactive state — no NgRx/manual subscriptions needed.
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Derived state via computed signals.
  readonly totalCount = computed(() => this._tasks().length);
  readonly doneCount = computed(
    () => this._tasks().filter((t) => t.status === 'done').length
  );
  readonly progressPercent = computed(() => {
    const total = this.totalCount();
    return total === 0 ? 0 : Math.round((this.doneCount() / total) * 100);
  });

  fetchTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<Task[]>(API_URL)
      .pipe(
        tap((tasks) => this._tasks.set(tasks)),
        catchError((err) => {
          this._error.set('Could not load tasks. Is the API server running?');
          console.error(err);
          return of([] as Task[]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe();
  }

  createTask(newTask: NewTask) {
    return this.http.post<Task>(API_URL, newTask).pipe(
      tap((created) => this._tasks.update((list) => [...list, created])),
      catchError((err) => {
        this._error.set('Could not create task.');
        console.error(err);
        return of(null);
      })
    );
  }

  updateTask(id: number, changes: Partial<NewTask>) {
    return this.http.patch<Task>(`${API_URL}/${id}`, changes).pipe(
      tap((updated) =>
        this._tasks.update((list) =>
          list.map((t) => (t.id === id ? updated : t))
        )
      ),
      catchError((err) => {
        this._error.set('Could not update task.');
        console.error(err);
        return of(null);
      })
    );
  }

  setStatus(id: number, status: TaskStatus) {
    return this.updateTask(id, { status });
  }

  deleteTask(id: number) {
    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      tap(() => this._tasks.update((list) => list.filter((t) => t.id !== id))),
      catchError((err) => {
        this._error.set('Could not delete task.');
        console.error(err);
        return of(null);
      })
    );
  }
}
