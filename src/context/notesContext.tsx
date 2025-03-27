import { db } from "@/firebaseConfig";
import { Notes } from "@/types/types";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useState, useEffect, useContext } from "react";

// Create the context
const NotesContext = createContext<Notes[]>([]);

// Notes Provider Component
export function NotesProvider({ children }: { children: any }) {
  const [notesData, setNotesData] = useState<Notes[]>([]);
  const [status, setStatus] = useState("Saved");
  const notesRef = collection(db, "notesFolder");

  // Simulated API Call (Can replace with real backend call)
  // const saveNotes = async (updatedNotes) => {
  //   setStatus("Saving...");
  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
  //   console.log("Notes saved:", updatedNotes);
  //   setStatus("Saved");
  // };

  const deleteFolder = (id: number) => {
    var tempNotes = notesData;
    tempNotes = tempNotes.filter((folder) => folder.id !== id);
    console.log(tempNotes);
    setNotesData(tempNotes);
  };

  const renameFolder = (id: number, newName: string) => {
    var tempNotes = notesData;
    var renamed = tempNotes.map((obj) => {
      if (obj.id === id) {
        return { ...obj, folder: newName };
      }
      return obj;
    });

    setNotesData(renamed);
  };

  const deleteNote = (folderId: number, noteId: number) => {
    var tempNotes = JSON.parse(JSON.stringify(notesData));
    console.log(notesData);
    var folderItems = tempNotes.filter(
      (obj: { id: number }) => obj.id === folderId
    )[0].items;
    var noteIndex = folderItems.findIndex(
      (obj: { id: number }) => obj.id === noteId
    );
    folderItems.splice(noteIndex, 1);

    tempNotes.filter((obj: { id: number }) => obj.id === folderId)[0].items =
      folderItems;
    console.log(tempNotes);
    setNotesData(tempNotes);
  };

  const addNote = (folderId: number, title: string) => {
    var tempNotes = notesData;
    var newNote = {
      title: title,
      content: "",
      createdAt: "13/3/2023",
      id: 16126712,
    };

    tempNotes
      .filter((folder) => folder.id === folderId)[0]
      ["items"].push(newNote);

    console.log(tempNotes);

    // setNoteToAdd("");
  };

  const createFolder = (folderName: string) => {
    var newFolder = {
      folder: folderName,
      id: 5178951,
      items: [],
    };

    var tempNotes = notesData;
    tempNotes.push(newFolder);
    setNotesData(tempNotes);
    // setFolderAdd("");
  };

  useEffect(() => {
    const getNotes = async () => {
      const querySnapshot = await getDocs(notesRef);
      const notesArray = querySnapshot.docs.map((doc) => ({
        id: Number(doc.id),
        ...doc.data(),
      })) as Notes[];
      console.log(notesArray);
      setNotesData(notesArray);
    };
    getNotes();
  }, []);

  // Auto-save after changes with debounce
  // useEffect(() => {
  //   if (notes.length === 0) return;
  //   const timer = setTimeout(() => saveNotes(notes), 5000);
  //   return () => clearTimeout(timer);
  // }, [notes]);

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
