import { LucideIcon } from "lucide-react";
import { ColumnId } from "@/components/Tasks/TasksBoard/KanbanBoard";
export interface Notes {
  folder: string;
  id: number;
  items: SingleNote[];
}

export interface SingleNote {
  title: string;
  content: string;
  id: number;
  createdAt: string;
}

export interface TasksFolder {
  folder: string;
  id: number;
  icon: string;
  items: SingleTask[];
}

export interface SingleTask {
  task: string;
  description: string;
  id: number;
  createdAt: string;
  status: ColumnId;
}
