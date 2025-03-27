import React, { Dispatch, SetStateAction, useEffect } from "react";
import { KanbanBoard } from "./TasksBoard/KanbanBoard";
import { useLocation, useOutletContext, useParams } from "react-router";
import { SingleTask, TasksFolder } from "@/types/types";

export default function Tasks() {
  const [tasks, createTask, editTask, deleteTask]: [
    TasksFolder[],
    (
      columnId: any,
      taskName: string,
      taskDescription: string,
      id: number
    ) => void,
    (
      taskName: string,
      taskDescription: string,
      task: SingleTask,
      id: number
    ) => void,
    (task: SingleTask, id: number) => void
  ] = useOutletContext();
  const { id } = useParams();
  
  var tasksData = tasks.filter((obj) => obj.id === Number(id))[0].items;

  return (
    <div>
      <KanbanBoard
        tasksData={tasksData}
        createTask={createTask}
        editTask={editTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}
