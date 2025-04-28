import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Task, TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { CirclePlus, GripVertical, Flag } from "lucide-react";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { SingleTask, TasksFolder } from "@/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColumnId } from "./KanbanBoard";
import { useParams } from "react-router";
import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: SingleTask[];
  isOverlay?: boolean;
  createTask: (
    columnId: any,
    taskName: string,
    taskDescription: string,
    priority: string,
    id: TasksFolder["id"],
    dueDate?: Timestamp
  ) => void;
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

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  createTask,
  editTask,
  deleteTask,
}: BoardColumnProps) {
  const { id } = useParams();
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const [taskNameToAdd, setTaskNameToAdd] = useState("");
  const [taskDescToAdd, setTaskDescToAdd] = useState("");
  const [dueDate, setDueDate] = React.useState<Date>();
  const [priority, setPriority] = useState<string>("low");

  const createTask2 = (columnId: UniqueIdentifier) => {
    createTask(
      columnId,
      taskNameToAdd,
      taskDescToAdd,
      priority,
      id,
      dueDate !== undefined ? Timestamp.fromDate(dueDate) : undefined
    );
    setTaskNameToAdd("");
    setTaskDescToAdd("");
    setPriority("low");
    setDueDate(undefined);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-screen w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center ml-10",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <span
          className={`${
            column.title === "Todo"
              ? "text-yellow-400"
              : column.title === "In progress"
              ? "text-sky-400"
              : column.title === "Done"
              ? "text-green-400"
              : ""
          }`}
        >
          {" "}
          {column.title}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"ghost"} className="cursor-pointer">
              <CirclePlus />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            onEscapeKeyDown={() => {
              setTaskDescToAdd("");
              setTaskNameToAdd("");
              setDueDate(undefined);
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Create new task</AlertDialogTitle>
              <AlertDialogDescription>
                Add your title and description. Click create when you're done.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task" className="text-right">
                  Task name
                </Label>
                <Input
                  id="task"
                  value={taskNameToAdd}
                  onChange={(e) => {
                    setTaskNameToAdd(e.target.value);
                  }}
                  className="col-span-3"
                />
                <Label htmlFor="taskDesc" className="text-right">
                  Task description
                </Label>
                <Input
                  id="taskDesc"
                  value={taskDescToAdd}
                  onChange={(e) => {
                    setTaskDescToAdd(e.target.value);
                  }}
                  className="col-span-3"
                />
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  defaultValue="low"
                  onValueChange={(e) => {
                    setPriority(e);
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
                        "w-[340px] justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {dueDate ? (
                        format(dueDate, "PPP")
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
                        setDueDate(addDays(new Date(), parseInt(value)))
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
                        selected={dueDate}
                        onSelect={setDueDate}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setTaskDescToAdd("");
                  setTaskNameToAdd("");
                  setDueDate(undefined);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  onClick={() => {
                    createTask2(column.id);
                    toast.success("Task Added", {
                      description: `Task with name: ${taskNameToAdd} and description: ${taskDescToAdd} added to ${column.title}`,
                    });
                  }}
                  disabled={taskNameToAdd === "" || taskDescToAdd === ""}
                >
                  Create task
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <span className="ml-auto"> {tasks.length}</span>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                editTask={editTask}
                deleteTask={deleteTask}
              />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();
  const { state } = useSidebar();

  const variations = cva("px-2 md:px-0 flex lg:justify-center", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div
        className={`flex gap-4 items-center flex-row justify-center ${
          state === "collapsed" ? "ml-40" : "ml-10"
        }`}
      >
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
