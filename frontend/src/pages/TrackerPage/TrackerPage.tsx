import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './TrackerPage.css'; // Import the CSS file
import { error } from 'console';
import MapComponent from '../../components/Map/Map';
import { checkAuth } from '../../components/checkAuth';
import { Navigate } from 'react-router-dom'; // adjust the path according to your file structure

function TrackerPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null); 
    const [visits, setVisits] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            const authStatus = await checkAuth(); // replace with your auth checking function
            setIsAuthenticated(authStatus);
        };
            checkAuthentication();
        }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/user`) // Fetch all users
            .then(response => setUsers(response.data));
    }, []);

    const onPreviousDay = () => {
        setCurrentDate(prevDate => {
            const newDate = moment(prevDate).add(-1, 'day').toDate();
            console.log('Previous day:', newDate);
            return newDate;
        });
    };
    
    const onNextDay = () => {
        setCurrentDate(prevDate => {
            const newDate = moment(prevDate).add(1, 'day').toDate();
            console.log('Next day:', newDate);
            return newDate;
        });
    };
    
    useEffect(() => {
        if (selectedUser) {
            console.log('Fetching visits for user:', selectedUser.id);
            axios.get(`${process.env.REACT_APP_URL}/user/${selectedUser.id}/visits`) // Fetch visits of the selected user
                .then(response => {
                    const visitPromises = response.data.map((visit: any) => {
                        return axios.get(`${process.env.REACT_APP_URL}/clients/${visit.clientId}`) // Fetch company name and coordinates
                            .then(clientResponse => {
                                const longitude = parseFloat(clientResponse.data.longitude);
                                const latitude = parseFloat(clientResponse.data.latitude);

                                console.log(`Coordinates for visit ${visit.id}:`, longitude, latitude);
                                console.log(`Type of longitude: ${typeof longitude}, Type of latitude: ${typeof latitude}`);

                                let coordinates = null;
                                if (!isNaN(longitude) && !isNaN(latitude)) {
                                    coordinates = [longitude, latitude];
                                } else {
                                    console.error(`Invalid coordinates for visit: ${visit.id}`);
                                }

                                return {
                                    ...visit,
                                    companyName: clientResponse.data.companyName,
                                    meetingTime: visit.meetingTime ? new Date(visit.meetingTime) : null,
                                    coordinates: coordinates
                                };
                            });
                    });

                    return Promise.all(visitPromises);
                })
                .then(allVisits => {
                    // Filter the visits to include only those for the selected date
                    const visitsForSelectedDate = allVisits.filter((visit: any) => {
                      const visitDate = moment(visit.meetingTime).format('YYYY-MM-DD');
                      const selectedDate = moment(currentDate).format('YYYY-MM-DD');
                      return visitDate === selectedDate;
                    });
                  
                    // Sort the visits chronologically
                    const sortedVisits = visitsForSelectedDate.sort((a: any, b: any) => {
                      return new Date(a.meetingTime).getTime() - new Date(b.meetingTime).getTime();
                    });
                  
                    setVisits(sortedVisits as never[]);
                  });
                  
        }
    }, [selectedUser, currentDate]);

    const filteredUsers = users.filter((user: { name: string }) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isAuthenticated === false) {
        return <Navigate to="/login" replace />; // replace with your login route
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or your own loading component
    }

    return (
        <div className="tracker-page">
            <div className="user-list">
            <input 
                type="text" 
                placeholder="Search users" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <ul className="user-list-items">
                {filteredUsers.map((user: { id: string, name: string }) => (
                    <li key={user.id} className="user-list-item" onClick={() => setSelectedUser(user)}>
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
            {selectedUser && (
                <div className="user-data">
                    <h1>{selectedUser.name}</h1>
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
                        {visits.map((visit: { title: string, meetingTime: Date, companyName: string }, index: number) => (
                            <li key={index} className="calendar-event">
                                <h2 className="event-title">{visit.companyName}</h2>
                                <p className="event-time">Time: {visit.meetingTime ? visit.meetingTime.toString() : 'N/A'}</p>
                            </li>
                        ))}
                    </ul>
                    <div className='map-container'>
                        {visits.length > 0 ? (
                            <MapComponent locations={visits} />
                        ) : (
                            <p>No visits to show for this user on this date.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrackerPage;