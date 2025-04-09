import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../../ui/badge";
import { ColumnId } from "./KanbanBoard";
import { SingleTask, TasksFolder } from "@/types/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../ui/context-menu";
import { Separator } from "@radix-ui/react-separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams } from "react-router";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
}

interface TaskCardProps {
  task: SingleTask;
  isOverlay?: boolean;
  editTask: (
    taskName: string,
    taskDescription: string,
    task: SingleTask,
    id: TasksFolder["id"]
  ) => void;
  deleteTask: (task: SingleTask, id: TasksFolder["id"]) => void;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: SingleTask;
}

export function TaskCard({
  task,
  isOverlay,
  editTask,
  deleteTask,
}: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDesc, setEditTaskDesc] = useState("");
  const { id } = useParams();
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          ref={setNodeRef}
          style={style}
          className={variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
          })}
        >
          <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative items-center">
            <Button
              variant={"ghost"}
              {...attributes}
              {...listeners}
              className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
            >
              <span className="sr-only">Move task</span>
              <GripVertical />
            </Button>
            <div className="text-xs font-semibold">{task.createdAt}</div>
            <Badge variant={"outline"} className="ml-auto font-semibold">
              Task
            </Badge>
          </CardHeader>
          <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
            <div>
              <div className="font-semibold">{task.task}</div>
              <div>{task.description}</div>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <ContextMenuItem
              inset
              onSelect={(e) => {
                e.preventDefault();
                setEditTaskName(task.task);
                setEditTaskDesc(task.description);
              }}
            >
              <Pencil className="text-muted-foreground" />
              <span>Edit task</span>
            </ContextMenuItem>
            <Separator className="bg-zinc-600 mt-1" />
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit task</AlertDialogTitle>
              <AlertDialogDescription>
                Edit your task here. Click save when you're done.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taskName" className="text-left">
                  Task name
                </Label>
                <Input
                  id="taskName"
                  value={editTaskName}
                  onChange={(e) => {
                    setEditTaskName(e.target.value);
                  }}
                  className="col-span-3"
                />
                <Label htmlFor="taskDesc" className="text-left">
                  Task description
                </Label>
                <Input
                  id="taskDesc"
                  value={editTaskDesc}
                  onChange={(e) => {
                    setEditTaskDesc(e.target.value);
                  }}
                  className="col-span-3"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  onClick={() => {
                    editTask(editTaskName, editTaskDesc, task, id);
                  }}
                >
                  Save changes
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <ContextMenuItem
              inset
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Trash2 className="text-muted-foreground" />
              <span>Delete task</span>
            </ContextMenuItem>
            <Separator className="bg-zinc-600 mt-1" />
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Do you wish to delete your task
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  onClick={() => {
                    deleteTask(task, id);
                  }}
                >
                  Delete task
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
}
