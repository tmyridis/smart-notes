import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { CalendarIcon, Flag, GripVertical, Pencil, Trash2 } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import React from "react";
import { Timestamp } from "firebase/firestore";

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
    priority: string,
    id: TasksFolder["id"],
    taskDueDate?: Timestamp
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
  const [editDueDate, setEditDueDate] = React.useState<Date>();
  const [editPriority, setEditPriority] = useState<string>("low");
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
            {task.dueTo && (
              <div className="text-xs font-semibold">
                {"Due to "}
                {new Date(task.dueTo.seconds * 1000).toLocaleString()}
              </div>
            )}
            <Badge variant={"outline"} className="ml-auto font-semibold w-20">
              <Flag
                strokeWidth={3}
                color={`${
                  task.priority === "high"
                    ? "red"
                    : task.priority === "medium"
                    ? "orange"
                    : "yellow"
                }`}
                fill={`${
                  task.priority === "high"
                    ? "red"
                    : task.priority === "medium"
                    ? "orange"
                    : "yellow"
                }`}
              />
              {task.priority}
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
                task.dueTo &&
                  setEditDueDate(new Date(task.dueTo.seconds * 1000));
                setEditPriority(task.priority);
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
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  defaultValue={editPriority}
                  onValueChange={(e) => {
                    setEditPriority(e);
                  }}
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      <SelectItem value="low">
                        <Flag strokeWidth={3} color="yellow" fill="yellow" />
                        Low
                      </SelectItem>
                      <SelectItem value="medium">
                        <Flag strokeWidth={3} color="orange" fill="orange" />
                        Medium
                      </SelectItem>
                      <SelectItem value="high">
                        <Flag strokeWidth={3} color="red" fill="red" />
                        High
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Label htmlFor="dueDate" className="text-right">
                  Due date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !editDueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {editDueDate ? (
                        format(editDueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="flex w-auto flex-col space-y-2 p-2"
                  >
                    <Select
                      onValueChange={(value: any) =>
                        setEditDueDate(addDays(new Date(), parseInt(value)))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="rounded-md border">
                      <Calendar
                        mode="single"
                        selected={editDueDate}
                        onSelect={setEditDueDate}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  disabled={editTaskDesc === "" || editTaskName === ""}
                  onClick={() => {
                    editTask(
                      editTaskName,
                      editTaskDesc,
                      task,
                      editPriority,
                      id,
                      editDueDate
                    );
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
