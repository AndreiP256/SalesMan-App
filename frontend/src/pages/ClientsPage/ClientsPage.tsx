import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';

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
        <Table data={clients} columns={columns} />
    );
}

export default ClientsPage;