import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';
import { visitsEdit } from '../../components/EditAdd/editService';
import { AddForm } from '../../components/EditAdd/addService';
import { visitsDelete } from '../../components/EditAdd/deleteService';
import { checkAuth } from '../../components/checkAuth';
import { Navigate } from 'react-router-dom';

function VisitsPage() {
    const [visits, setVisits] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
            }
        };

        checkAuthentication();
    }, []);

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
            <AddForm columns={columns} addType="visit"/>
            <Table data={visits} columns={columns} onEdit={visitsEdit} onDelete={visitsDelete}/>
        </div>
    );
}

export default VisitsPage;