import { db } from "@/firebaseConfig";
import { SingleTask, TasksFolder } from "@/types/types";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useState, useEffect, useContext } from "react";

const initialState = [
  {
    folder: "",
    icon: "",
    id: 0,
    items: [
      {
        task: "",
        description: "",
        id: 0,
        createdAt: "",
        status: {
          id: "",
          title: "",
        },
      },
    ],
  },
];
// Create the context
const TasksContext = createContext<TasksFolder[]>([]);

// Notes Provider Component
export function TasksProvider({ children }: { children: any }) {
  const [tasksData, setTasksData] = useState<TasksFolder[]>([]);
  const [status, setStatus] = useState("Saved");
  const tasksRef = collection(db, "tasksFolder");

  // Simulated API Call (Can replace with real backend call)
  // const saveNotes = async (updatedNotes) => {
  //   setStatus("Saving...");
  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  //   console.log("Notes saved:", updatedNotes);
  //   setStatus("Saved");
  // };

  const deleteFolder = (id: number) => {
    var tempNotes = tasksData;
    tempNotes = tempNotes.filter((folder) => folder.id !== id);
    console.log(tempNotes);
    setTasksData(tempNotes);
  };

  const renameFolder = (id: number, newName: string) => {
    var tempNotes = tasksData;
    var renamed = tempNotes.map((obj) => {
      if (obj.id === id) {
        return { ...obj, folder: newName };
      }
      return obj;
    });

    setTasksData(renamed);
  };

  const createFolder = (folderName: string, emoji: string) => {
    var newFolder = {
      folder: folderName,
      id: 5178951,
      icon: emoji,
      items: [],
    };

    var tempNotes = tasksData;
    tempNotes.push(newFolder);
    setTasksData(tempNotes);
  };

  const createTask = (
    columnId: any,
    taskName: string,
    taskDescription: string,
    id: number
  ) => {
    if (taskName !== "" && taskDescription !== "") {
      var newTask: SingleTask = {
        id: 5151,
        task: taskName,
        description: taskDescription,
        createdAt: "13/3/2025",
        status: columnId,
      };
      console.log(newTask);
      console.log(id);
      var tempTasks = JSON.parse(JSON.stringify(tasksData));
      var taskFolder = tempTasks.find((obj: { id: number }) => obj.id === id);
      taskFolder.items.push(newTask);
      console.log(taskFolder);
      var idx = tempTasks.map((e: { id: any }) => e.id).indexOf(id);
      if (idx !== -1) {
        tempTasks[idx] = taskFolder;
      }
      console.log(tempTasks);
      setTasksData(tempTasks);
    }
    console.log(tasksData);
  };

  const editTask = (
    taskName: string,
    taskDescription: string,
    task: SingleTask,
    id: number
  ) => {
    if (taskName !== "" && taskDescription !== "") {
      var editedTask = task;
      editedTask["task"] = taskName;
      editedTask["description"] = taskDescription;

      var tempTasks = JSON.parse(JSON.stringify(tasksData));
      var taskFolder = tempTasks.find((obj: { id: number }) => obj.id === id);
      taskFolder.items.map((item: SingleTask) => {
        if (item.id === editedTask.id) {
          item = editedTask;
        }
      });
      var idx = tempTasks.map((e: { id: any }) => e.id).indexOf(id);
      if (idx !== -1) {
        tempTasks[idx] = taskFolder;
      }
      console.log(tempTasks);
      setTasksData(tempTasks);
    }
  };

  const deleteTask = (task: SingleTask, id: number) => {
    var tempTasks = JSON.parse(JSON.stringify(tasksData));
    var taskFolder = tempTasks.find((obj: { id: number }) => obj.id === id);

    const taskIdx = taskFolder.items.findIndex(
      (obj: SingleTask) => obj.id === task.id
    );

    taskFolder.items.splice(taskIdx, 1);
    console.log(taskFolder);

    var idx = tempTasks.map((e: { id: any }) => e.id).indexOf(id);
    if (idx !== -1) {
      tempTasks[idx] = taskFolder;
    }
    console.log(tempTasks);
    setTasksData(tempTasks);
  };

  useEffect(() => {
    const getTasks = async () => {
      const querySnapshot = await getDocs(tasksRef);
      const tasksArray = querySnapshot.docs.map((doc) => ({
        id: Number(doc.id),
        ...doc.data(),
      })) as TasksFolder[];
      console.log(tasksArray);
      setTasksData(tasksArray);
    };
    getTasks();
  }, []);

  // Auto-save after changes with debounce
  // useEffect(() => {
  //   if (notes.length === 0) return;
  //   const timer = setTimeout(() => saveNotes(notes), 5000);
  //   return () => clearTimeout(timer);
  // }, [notes]);

  return (
    <TasksContext.Provider
      value={{
        tasksData,
        setTasksData,
        status,
        createFolder,
        deleteFolder,
        renameFolder,
        createTask,
        deleteTask,
        editTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

// Custom Hook to use NotesContext
export function useTasks() {
  return useContext(TasksContext);
}
