export type TaskStatusContract = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriorityContract = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TaskContract {
  id: string;
  title: string;
  description?: string;
  status: TaskStatusContract;
  priority: TaskPriorityContract;
  projectId: string;
  assigneeId?: string;
  createdById: string;
}
