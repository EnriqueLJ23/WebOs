export interface Task {
  id: string;
  userId: string;
  title: string;
  summary: string;
  status: string;
   priority: string;
  dueDate: string;
}

export interface NewTaskData {
  priority: string;
  title: string;
  summary: string;
  status: string;
  date: string;
}