import { db } from "@/firebaseConfig";
import { Notes, SingleNote } from "@/types/types";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";
// Create the context
const NotesContext = createContext<any>([]);

// Notes Provider Component
export function NotesProvider({ children }: { children: any }) {
  const [notesData, setNotesData] = useState<Notes[]>([]);
  const [status, setStatus] = useState("Saved");
  const notesRef = collection(db, "notesFolder");

  const deleteFolder = (id: Notes["id"]) => {
    var tempNotes = notesData;
    tempNotes = tempNotes.filter((folder) => folder.id !== id);
    console.log(tempNotes);
    setNotesData(tempNotes);
    localStorage.setItem("notes", JSON.stringify(tempNotes));
  };

  const renameFolder = (id: Notes["id"], newName: string) => {
    var tempNotes = notesData;
    var renamed = tempNotes.map((obj) => {
      if (obj.id === id) {
        return { ...obj, folder: newName };
      }
      return obj;
    });

    setNotesData(renamed);
    localStorage.setItem("notes", JSON.stringify(renamed));
  };

  const deleteNote = (folderId: Notes["id"], noteId: SingleNote["id"]) => {
    var tempNotes = JSON.parse(JSON.stringify(notesData));
    console.log(notesData);
    var folderItems = tempNotes.filter(
      (obj: { id: Notes["id"] }) => obj.id === folderId
    )[0].items;
    var noteIndex = folderItems.findIndex(
      (obj: { id: SingleNote["id"] }) => obj.id === noteId
    );
    folderItems.splice(noteIndex, 1);

    tempNotes.filter(
      (obj: { id: Notes["id"] }) => obj.id === folderId
    )[0].items = folderItems;
    console.log(tempNotes);
    setNotesData(tempNotes);
    localStorage.setItem("notes", JSON.stringify(tempNotes));
  };

  const addNote = (folderId: Notes["id"], title: string) => {
    var tempNotes = notesData;
    var newNote = {
      title: title,
      content: "",
      createdAt: Timestamp.fromDate(new Date()),
      id: uuidv4(),
    };

    console.log(Timestamp.fromDate(new Date()));

    tempNotes
      .filter((folder) => folder.id === folderId)[0]
      ["items"].push(newNote);

    console.log(tempNotes);
    setNotesData(tempNotes);
    localStorage.setItem("notes", JSON.stringify(tempNotes));
  };

  const createFolder = async (folderName: string) => {
    var newFolder = {
      folder: folderName,
      id: uuidv4(),
      items: [],
    };

    var tempNotes = notesData;
    tempNotes.push(newFolder);
    setNotesData(tempNotes);
    localStorage.setItem("notes", JSON.stringify(tempNotes));

    await setDoc(doc(db, "notesFolder", newFolder.id), newFolder);
  };

  useEffect(() => {
    const getNotes = async () => {
      const localNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      if (localNotes.length > 0) {
        setNotesData(localNotes);
      } else {
        const querySnapshot = await getDocs(notesRef);
        const notesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notes[];
        console.log(notesArray);
        localStorage.setItem("notes", JSON.stringify(notesArray));
        setNotesData(notesArray);
      }
    };
    getNotes();
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notesData,
        setNotesData,
        status,
        createFolder,
        addNote,
        renameFolder,
        deleteNote,
        deleteFolder,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

// Custom Hook to use NotesContext
export function useNotes() {
  return useContext(NotesContext);
}
