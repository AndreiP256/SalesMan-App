import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';
import { clientsEdit } from '../../components/EditAdd/editService';
import { AddForm } from '../../components/EditAdd/addService';
import { clientsDelete } from '../../components/EditAdd/deleteService';
import { checkAuth } from '../../components/checkAuth';
import { Navigate } from 'react-router-dom';

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            const authStatus = await checkAuth(); // replace with your auth checking function
            setIsAuthenticated(authStatus);

            if (authStatus) {
                axios.get(process.env.REACT_APP_URL + '/clients')
                    .then(response => {
                        setClients(response.data);
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

    const columns = ['id', 'description', 'companyName', 'taxCode', 'latitude', 'longitude', 'totalOrder', 'salesAgentId', 'clientCode']; // replace with your actual columns

    return (
        <>
            <h1>Clients</h1>
            <AddForm columns={columns} addType="client" />
            <Table data={clients} columns={columns} onEdit={clientsEdit} onDelete={clientsDelete} />
        </>
    );
}

export default ClientsPage;