export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskUrgency= 0 | 1 | 2;

export interface Task {
  id: number;
  title: string;
  urgency: TaskUrgency;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date string
}

export type NewTask = Omit<Task, 'id'>;
