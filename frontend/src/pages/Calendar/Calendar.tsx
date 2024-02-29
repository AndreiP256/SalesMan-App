import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, View, NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function MyCalendar() {
  type Event = {
    start: Date;
    end: Date;
    title: string;
  };
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('week');

  const fetchEvents = useCallback(async () => {
    const start = moment(currentDate).startOf(currentView as moment.unitOfTime.StartOf).toISOString();
    const end = moment(currentDate).endOf(currentView as moment.unitOfTime.StartOf).toISOString();

    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/visit/dateRange`, {
        params: {
          start,
          end,
        },
      });

      const fetchedEvents = response.data.map((item: any) => ({
        start: new Date(item.nextMeeting),
        end: new Date(item.nextMeeting),
        title: item.title,
      }));

      setEvents(fetchedEvents);
    } catch (error) {
      console.error(error);
    }
  }, [currentDate, currentView]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div style={{ height: 500 }}>
      <button onClick={fetchEvents}>Refetch Events</button>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['week']}
        defaultView='week'
        onNavigate={(newDate: Date, view: View, action: NavigateAction) => setCurrentDate(newDate)}
        onView={(view: View) => setCurrentView(view)}
      />
    </div>
  );
}

export default MyCalendar;