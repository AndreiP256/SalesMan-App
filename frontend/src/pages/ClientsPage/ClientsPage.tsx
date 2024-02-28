import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';
import { clientsEdit } from '../../components/EditAdd/editService';
import { AddForm } from '../../components/EditAdd/addService';
import { clientsDelete } from '../../components/EditAdd/deleteService';

function ClientsPage() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_URL + '/clients')
            .then(response => {
                setClients(response.data);
            })
            .catch(error => console.error(error));
    }, []);

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