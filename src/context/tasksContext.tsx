import { db } from "@/firebase/firebaseConfig";
import { SingleTask, TasksFolder } from "@/types/types";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./authContext";
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
  const { user } = useAuth();

  const fetchTasks = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  const deleteFolder = async (id: TasksFolder["id"]) => {
    var tempTasks = tasksData;
    tempTasks = tempTasks.filter((folder) => folder.id !== id);
    console.log(tempTasks);
    setTasksData(tempTasks);
    localStorage.setItem("tasks", JSON.stringify(tempTasks));
    console.log(tempTasks);
    if (user) {
      const uid = user.uid;
      console.log(uid);
      const ref = doc(db, "users", uid);
      console.log(ref);
      await updateDoc(ref, { tasksFolder: tempTasks });
    }
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
    console.log(renamed);
    setTasksData(renamed);
    localStorage.setItem("tasks", JSON.stringify(renamed));

    if (user) {
      const uid = user.uid;
      console.log(uid);
      const ref = doc(db, "users", uid);
      console.log(ref);
      await updateDoc(ref, { tasksFolder: renamed });
    }
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

    if (user) {
      const uid = user.uid;
      console.log(uid);
      const ref = doc(db, "users", uid);
      console.log(ref);
      await updateDoc(ref, { tasksFolder: tempTasks });
    }
  };

  const createTask = async (
    columnId: any,
    taskName: string,
    taskDescription: string,
    priority: string,
    id: TasksFolder["id"],
    dueDate?: Timestamp
  ) => {
    if (taskName !== "" && taskDescription !== "") {
      var newTask: SingleTask = {
        id: uuidv4(),
        task: taskName,
        description: taskDescription,
        createdAt: Timestamp.fromDate(new Date()),
        dueTo: dueDate,
        priority: priority,
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
      console.log(tempTasks);

      if (user) {
        const uid = user.uid;
        console.log(uid);
        const ref = doc(db, "users", uid);
        console.log(ref);
        await updateDoc(ref, { tasksFolder: tempTasks });
      }
    }
    console.log(tasksData);
  };

  const editTask = async (
    taskName: string,
    taskDescription: string,
    task: SingleTask,
    priority: string,
    id: TasksFolder["id"],
    taskDueDate?: Timestamp
  ) => {
    if (taskName !== "" && taskDescription !== "" && taskDueDate) {
      var editedTask = task;
      console.log(priority);
      editedTask["task"] = taskName;
      editedTask["description"] = taskDescription;
      editedTask["dueTo"] =
        taskDueDate !== undefined ? Timestamp.fromDate(taskDueDate) : undefined;
      editedTask["priority"] = priority;

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

      if (user) {
        const uid = user.uid;
        console.log(uid);
        const ref = doc(db, "users", uid);
        console.log(ref);
        await updateDoc(ref, { tasksFolder: tempTasks });
      }
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

    if (user) {
      const uid = user.uid;
      console.log(uid);
      const ref = doc(db, "users", uid);
      console.log(ref);
      await updateDoc(ref, { tasksFolder: tempTasks });
    }
  };

  useEffect(() => {
    const getTasks = async () => {
      if (user) {
        console.log(user);
        const localTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        if (localTasks.length > 0) {
          setTasksData(localTasks);
        } else {
          await fetchTasks(user.uid).then((result) => {
            console.log(result);
            if (result) {
              localStorage.setItem("tasks", JSON.stringify(result.tasksFolder));
              setTasksData(result.tasksFolder);
            }
          });
        }
      }
    };
    getTasks();
  }, [user]);

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
