import { LucideIcon } from "lucide-react";
import { ColumnId } from "@/components/Tasks/TasksBoard/KanbanBoard";
import { Timestamp } from "firebase/firestore";
export interface Notes {
  folder: string;
  id: string;
  items: SingleNote[];
}

export interface SingleNote {
  title: string;
  content: string;
  id: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  starred?: boolean;
}

export interface TasksFolder {
  folder: string;
  id: string | undefined;
  icon: string;
  items: SingleTask[];
}

export interface SingleTask {
  task: string;
  description: string;
  id: string;
  createdAt: Timestamp;
  status: ColumnId;
  dueTo?: Timestamp;
  priority: string;
}

export interface Event {
  title: string;
  description: string;
  id: string;
  start: Timestamp;
  end: Timestamp;
  allDay: boolean;
  location: string;
  color: string;
  editable?: boolean;
}
