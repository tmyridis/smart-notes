import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { Event } from "@/types/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const EventsContext = createContext<any>([]);

export function EventsProvider({ children }: { children: any }) {
  const { user } = useAuth();

  const [eventsData, setEventsData] = useState<Event[]>([]);

  const fetchEvents = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  const handleEventAdd = async (event: any) => {
    console.log(event);
    const tempEvents = [...eventsData, event];
    localStorage.setItem("events", JSON.stringify(tempEvents));
    setEventsData(tempEvents);

    if (user) {
      const uid = user.uid;
      console.log(uid);
      const ref = doc(db, "users", uid);
      console.log(ref);
      await updateDoc(ref, { eventsFolder: tempEvents });
    }
  };

  const handleEventUpdate = async (updatedEvent: any, isTask?: boolean) => {
    if (
      updatedEvent.editable === false &&
      (isTask === false || isTask === undefined)
    ) {
      return;
    }
    const tempEvents = eventsData.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    localStorage.setItem("events", JSON.stringify(tempEvents));
    setEventsData(tempEvents);

    if (user) {
      const uid = user.uid;
      console.log(uid);
      const ref = doc(db, "users", uid);
      console.log(ref);
      await updateDoc(ref, { eventsFolder: tempEvents });
    }
  };

  const handleEventDelete = async (eventId: any) => {
    const tempEvents = eventsData.filter((event) => event.id !== eventId);
    localStorage.setItem("events", JSON.stringify(tempEvents));
    setEventsData(tempEvents);

    if (user) {
      const uid = user.uid;
      console.log(uid);
      const ref = doc(db, "users", uid);
      console.log(ref);
      await updateDoc(ref, { eventsFolder: tempEvents });
    }
  };

  useEffect(() => {
    const getEvents = async () => {
      if (user) {
        console.log(user);
        const localEvents = JSON.parse(localStorage.getItem("events") || "[]");
        if (localEvents.length > 0) {
          console.log(localEvents);
          setEventsData(localEvents);
        } else {
          await fetchEvents(user.uid).then((result) => {
            console.log(result);
            if (result) {
              result.eventsFolder.forEach((item: any) => {
                item["start"] = new Date(item["start"].seconds * 1000);
                item["end"] = new Date(item["end"].seconds * 1000);
              });
              localStorage.setItem(
                "events",
                JSON.stringify(result.eventsFolder)
              );
              setEventsData(result.eventsFolder);
            }
          });
        }
      }
    };
    getEvents();
  }, [user]);

  return (
    <EventsContext.Provider
      value={{
        eventsData,
        setEventsData,
        handleEventAdd,
        handleEventUpdate,
        handleEventDelete,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}
