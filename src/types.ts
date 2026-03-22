export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}
