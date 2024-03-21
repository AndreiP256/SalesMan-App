import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';
import { visitsEdit } from '../../components/EditAdd/editService';
import { AddForm } from '../../components/EditAdd/addService';
import { visitsDelete } from '../../components/EditAdd/deleteService';
import { checkAuth } from '../../components/checkAuth';
import { Navigate } from 'react-router-dom';

function VisitsPage() {
    const [visits, setVisits] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [searchCompany, setSearchCompany] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        const checkAuthentication = async () => {
            const authStatus = await checkAuth(); // replace with your auth checking function
            setIsAuthenticated(authStatus);

            if (authStatus) {
                axios.get(process.env.REACT_APP_URL + '/visit')
                    .then(response => {
                        setVisits(response.data);
                    })
                    .catch(error => console.error(error));

                axios.get(process.env.REACT_APP_URL + '/clients')
                    .then(response => {
                        setClients(response.data);
                    })
                    .catch(error => console.error(error));

                axios.get(process.env.REACT_APP_URL + '/user')
                    .then(response => {
                        setUsers(response.data);
                    })
                    .catch(error => console.error(error));
            }
        };

        checkAuthentication();
    }, []);

    const handleSearchCompany = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchCompany(event.target.value);
    };

    const handleSearchDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchDate(event.target.value);
    }; // new handler function for search date

    const handleSearchUser = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchUser(event.target.value);
    };

    const clientMap = clients.reduce((map, client) => ({ ...map, [client.id]: client.companyName }), {});
    const userMap = users.reduce((map, user) => ({ ...map, [user.id]: user.name }), {});

    const updatedVisits = visits.map(visit => ({
        ...visit,
        clientId: clientMap[visit.clientId] || visit.clientId,
        userId: userMap[visit.userId] || visit.userId
    }));

    const filteredVisits = updatedVisits.filter(visit => {
        const clientName = visit.clientId.toLowerCase();
        const userName = visit.userId.toLowerCase();
        const meetingTime = new Date(visit.meetingTime).toISOString().split('T')[0];
    
        return clientName.includes(searchCompany.toLowerCase()) && userName.includes(searchUser.toLowerCase()) && meetingTime.includes(searchDate);
    }); // updated to filter by search date


    if (isAuthenticated === false) {
        return <Navigate to="/login" replace />; // replace with your login route
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or your own loading component
    }

    const columns = ['id', 'clientId', 'meetingTime', 'conclusion', 'nextMeeting', 'invoice', 'userId']; // replace with your actual columns

    return (
        <div>
            <h1>Visits</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="text" value={searchCompany} onChange={handleSearchCompany} placeholder="Search companies..." style={{ marginRight: '20px' }} />
                <input type="text" value={searchUser} onChange={handleSearchUser} placeholder="Search users..." style={{ marginRight: '20px' }} />
                <input type="date" value={searchDate} onChange={handleSearchDate} placeholder="Search date..." style={{ marginRight: '20px' }} /> {/* new input field for search date */}
                <AddForm columns={columns} addType="visit"/>
            </div>
            <Table data={filteredVisits} columns={columns} onEdit={visitsEdit} onDelete={visitsDelete}/>
        </div>
    );
}

export default VisitsPage;