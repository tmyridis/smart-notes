import { db } from "@/firebaseConfig";
import { SingleTask, TasksFolder } from "@/types/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
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
const TasksContext = createContext<any>([]);

// Tasks Provider Component
export function TasksProvider({ children }: { children: any }) {
  const [tasksData, setTasksData] = useState<TasksFolder[]>([]);
  const [status, setStatus] = useState("Saved");
  const tasksRef = collection(db, "tasksFolder");

  const deleteFolder = async (id: TasksFolder["id"]) => {
    var tempTasks = tasksData;
    tempTasks = tempTasks.filter((folder) => folder.id !== id);
    console.log(tempTasks);
    setTasksData(tempTasks);
    localStorage.setItem("tasks", JSON.stringify(tempTasks));

    const notesRef = collection(db, "tasksFolder");
    const q = query(notesRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const testRef = doc(db, "tasksFolder", querySnapshot.docs[0].id);
    console.log(testRef);

    await deleteDoc(doc(db, "tasksFolder", testRef.id));
  };

  const renameFolder = async (id: TasksFolder["id"], newName: string) => {
    var tempTasks = tasksData;
    var newFolder: TasksFolder = {
      folder: "",
      id: undefined,
      icon: "",
      items: [],
    };
    var renamed = tempTasks.map((obj) => {
      if (obj.id === id) {
        newFolder = { ...obj, folder: newName };
        return { ...obj, folder: newName };
      }
      return obj;
    });
    console.log(newFolder);
    setTasksData(renamed);
    localStorage.setItem("tasks", JSON.stringify(renamed));
    await setDoc(doc(db, "tasksFolder", newFolder.id), newFolder);
  };

  const createFolder = async (folderName: string, emoji: string) => {
    var newFolder = {
      folder: folderName,
      id: uuidv4(),
      icon: emoji,
      items: [],
    };

    var tempTasks = tasksData;
    tempTasks.push(newFolder);
    setTasksData(tempTasks);
    localStorage.setItem("tasks", JSON.stringify(tempTasks));

    await setDoc(doc(db, "tasksFolder", newFolder.id), newFolder);
  };

  const createTask = async (
    columnId: any,
    taskName: string,
    taskDescription: string,
    dueDate: Timestamp,
    id: TasksFolder["id"]
  ) => {
    if (taskName !== "" && taskDescription !== "") {
      var newTask: SingleTask = {
        id: uuidv4(),
        task: taskName,
        description: taskDescription,
        createdAt: Timestamp.fromDate(new Date()),
        dueTo: dueDate,
        status: columnId,
      };
      console.log(newTask);
      console.log(id);
      var tempTasks = JSON.parse(JSON.stringify(tasksData));
      var taskFolder = tempTasks.find(
        (obj: { id: TasksFolder["id"] }) => obj.id === id
      );
      taskFolder.items.push(newTask);
      console.log(taskFolder);

      var idx = tempTasks.map((e: { id: any }) => e.id).indexOf(id);
      if (idx !== -1) {
        tempTasks[idx] = taskFolder;
      }
      console.log(tempTasks);
      setTasksData(tempTasks);
      localStorage.setItem("tasks", JSON.stringify(tempTasks));
      const tasksRef = collection(db, "tasksFolder");
      const q = query(tasksRef, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      const testRef = doc(db, "tasksFolder", querySnapshot.docs[0].id);
      console.log(testRef);
      await updateDoc(testRef, { items: taskFolder?.items, ...taskFolder });
    }
    console.log(tasksData);
  };

  const editTask = async (
    taskName: string,
    taskDescription: string,
    taskDueDate: Timestamp,
    task: SingleTask,
    id: TasksFolder["id"]
  ) => {
    if (taskName !== "" && taskDescription !== "" && taskDueDate) {
      var editedTask = task;
      editedTask["task"] = taskName;
      editedTask["description"] = taskDescription;
      editedTask["dueTo"] = Timestamp.fromDate(taskDueDate);

      var tempTasks = JSON.parse(JSON.stringify(tasksData));
      var taskFolder = tempTasks.find(
        (obj: { id: TasksFolder["id"] }) => obj.id === id
      );
      taskFolder.items.map((item: SingleTask) => {
        if (item.id === editedTask.id) {
          item = editedTask;
        }
      });
      console.log(taskFolder);
      var idx = tempTasks.map((e: { id: any }) => e.id).indexOf(id);
      if (idx !== -1) {
        tempTasks[idx] = taskFolder;
      }
      console.log(tempTasks);
      setTasksData(tempTasks);
      localStorage.setItem("tasks", JSON.stringify(tempTasks));
      const tasksRef = collection(db, "tasksFolder");
      const q = query(tasksRef, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      const testRef = doc(db, "tasksFolder", querySnapshot.docs[0].id);
      console.log(testRef);
      await updateDoc(testRef, { items: taskFolder?.items, ...taskFolder });
    }
  };

  const deleteTask = async (task: SingleTask, id: TasksFolder["id"]) => {
    var tempTasks = JSON.parse(JSON.stringify(tasksData));
    var taskFolder = tempTasks.find(
      (obj: { id: TasksFolder["id"] }) => obj.id === id
    );

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
    localStorage.setItem("tasks", JSON.stringify(tempTasks));
    const tasksRef = collection(db, "tasksFolder");
    const q = query(tasksRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const testRef = doc(db, "tasksFolder", querySnapshot.docs[0].id);
    console.log(testRef);
    await updateDoc(testRef, { items: taskFolder?.items, ...taskFolder });
  };

  useEffect(() => {
    const getTasks = async () => {
      const localTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      if (localTasks.length > 0) {
        setTasksData(localTasks);
      } else {
        const querySnapshot = await getDocs(tasksRef);
        const tasksArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TasksFolder[];
        console.log(tasksArray);
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
        setTasksData(tasksArray);
      }
    };
    getTasks();
  }, []);

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

// Custom Hook to use TasksContext
export function useTasks() {
  return useContext(TasksContext);
}
