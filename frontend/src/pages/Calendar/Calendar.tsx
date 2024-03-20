import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './Calendar.css';
import { checkAuth } from '../../components/checkAuth';
import { Navigate } from 'react-router-dom';

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authStatus = await checkAuth(); // replace with your auth checking function
      setIsAuthenticated(authStatus);
      console.log(authStatus);
      console.log(isAuthenticated);
  
      if (authStatus) {
        const date = moment(currentDate).format('YYYY-MM-DD');
        try {
          const clientsResponse = await axios.get(`${process.env.REACT_APP_URL}/clients`);
          if (clientsResponse.data) {
            setClients(clientsResponse.data);
          }
  
          const visitsResponse = await axios.get(`${process.env.REACT_APP_URL}/visit/date/${date}`);
          if (visitsResponse.data) {
            const fetchedEvents = visitsResponse.data.map((item:any) => {
              const client = clientsResponse.data.find((client: any) => client.id === item.clientId);
              const companyName = client ? client.companyName : 'No company name';
  
              return {
                start: new Date(item.meetingTime),
                end: new Date(item.nextMeeting),
                title: companyName,
              };
            });
            setEvents(fetchedEvents);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
  
    checkAuthentication();
  }, [currentDate]);

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />; // replace with your login route
  }

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or your own loading component
  }

  const onPreviousDay = () => {
    setCurrentDate(prevDate => moment(prevDate).add(-1, 'day').toDate());
  };

  const onNextDay = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'day').toDate());
  };

  
return (
  <div className="calendar">
    <div className="calendar-header">
      <button className="calendar-button" onClick={onPreviousDay}>Previous Day</button>
      <input 
        type="date" 
        className="calendar-date" 
        value={moment(currentDate).format('YYYY-MM-DD')} 
        onChange={(e) => setCurrentDate(new Date(e.target.value))}
      />
      <button className="calendar-button" onClick={onNextDay}>Next Day</button>
    </div>
    <ul className="calendar-events">
      {events.map((event: {title: string, start: Date}, index) => (
        <li key={index} className="calendar-event">
          <h2 className="event-title">{event.title}</h2>
          <p className="event-time">Time: {event.start.toString()}</p>
        </li>
      ))}
    </ul>
  </div>
);
}

export default MyCalendar;