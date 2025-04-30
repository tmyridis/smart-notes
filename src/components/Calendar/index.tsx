import { useEffect, useState } from "react";
import { EventCalendar, type CalendarEvent } from ".//event-calendar";
import { useEvents } from "@/context/eventsContext";

export default function Calendar() {
  const { eventsData, handleEventAdd, handleEventUpdate, handleEventDelete } =
    useEvents();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(eventsData);
    console.log(eventsData);
  }, [eventsData]);

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      initialView="month"
    />
  );
}
