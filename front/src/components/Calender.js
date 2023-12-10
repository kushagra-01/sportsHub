import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const CalendarComponent = ({ availableSlots }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Format availableSlots as FullCalendar events
    const formattedEvents = availableSlots.map((slot) => ({
      title: 'Available',
      start: `2023-12-25T${slot}`,
    }));

    setEvents(formattedEvents);
  }, [availableSlots]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
    />
  );
};

export default CalendarComponent;
