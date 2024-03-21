import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';
import { clientsEdit } from '../../components/EditAdd/editService';
import { AddForm } from '../../components/EditAdd/addService';
import { clientsDelete } from '../../components/EditAdd/deleteService';
import { checkAuth } from '../../components/checkAuth';
import { Navigate } from 'react-router-dom';

function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
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

                axios.get(process.env.REACT_APP_URL + '/user')
                    .then(response => {
                        setUsers(response.data);
                    })
                    .catch(error => console.error(error));
            }
        };

        checkAuthentication();
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const userMap = users.reduce((map, user) => ({ ...map, [user.id]: user.name }), {});

    const updatedClients = clients.map(client => ({
        ...client,
        salesAgentId: userMap[client.salesAgentId] || client.salesAgentId
    }));

    const filteredClients = updatedClients.filter((client: { companyName: string }) => 
        client.companyName.toLowerCase().includes(search.toLowerCase())
    );

    if (isAuthenticated === false) {
        return <Navigate to="/login" replace />; // replace with your login route
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or your own loading component
    }

    const columns = ['id', 'description', 'companyName', 'taxCode', 'latitude', 'longitude', 'totalOrder', 'salesAgentId']; // replace with your actual columns

    return (
        <>
            <h1>Clients</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="text" value={search} onChange={handleSearch} placeholder="Search clients..." style={{ marginRight: '20px' }} />
                <AddForm columns={columns} addType="client" />
            </div>
            <Table data={filteredClients} columns={columns} onEdit={clientsEdit} onDelete={clientsDelete} />
        </>
    );
}

export default ClientsPage;