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
      id: TasksFolder["id"]
    ) => void,
    (
      taskName: string,
      taskDescription: string,
      task: SingleTask,
      id: TasksFolder["id"]
    ) => void,
    (task: SingleTask, id: TasksFolder["id"]) => void
  ] = useOutletContext();
  const { id } = useParams();

  var tasksData: SingleTask[] = [];

  if (tasks.length > 0) {
    var tempData = tasks.filter((obj) => obj.id === id);
    if (tempData.length > 0) {
      tasksData = tempData[0].items;
    }
  }

  return (
    <>
      <div>
        <KanbanBoard
          tasksDatatest={tasksData}
          createTask={createTask}
          editTask={editTask}
          deleteTask={deleteTask}
        />
      </div>
    </>
  );
}
