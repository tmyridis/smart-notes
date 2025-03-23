import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Task, TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { CirclePlus, GripVertical } from "lucide-react";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { SingleTask } from "@/types/types";
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
    id: number
  ) => void;
  editTask: (
    taskName: string,
    taskDescription: string,
    task: SingleTask,
    id: number
  ) => void;
  deleteTask: (task: SingleTask, id: number) => void;
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

  console.log(tasksIds);

  const [taskNameToAdd, setTaskNameToAdd] = useState("");
  const [taskDescToAdd, setTaskDescToAdd] = useState("");

  const createTask2 = (columnId: UniqueIdentifier) => {
    createTask(columnId, taskNameToAdd, taskDescToAdd, Number(id));
    setTaskNameToAdd("");
    setTaskDescToAdd("");
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create new task</AlertDialogTitle>
              <AlertDialogDescription>
                Add your title and description. Click create when you're done.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
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
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  onClick={() => {
                    createTask2(column.id);
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
              <TaskCard key={task.id} task={task} editTask={editTask} deleteTask={deleteTask} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
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
      <div className="flex gap-4 items-center flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
