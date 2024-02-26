import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';

function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_URL + '/user')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    const columns = ['id', 'name', 'phone', 'role', 'agentCode']; // replace with your actual columns

    return (
        <Table data={users} columns={columns} />
    );
}

export default UsersPage;