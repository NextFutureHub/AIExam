export type Task = {
  id: string;
  name: string;
  criteria: string;
};

export type Exam = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
};
