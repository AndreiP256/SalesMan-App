import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';
import { usersEdit } from '../../components/EditAdd/editService';
import { AddForm } from '../../components/EditAdd/addService';

function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_URL + '/user')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    const columns = ['id', 'name', 'phone', 'role']; // replace with your actual columns
    const addColumns = [...columns, 'agentCode'];
    return (
        <div>
            <h1>Users</h1>
            <AddForm columns={addColumns} addType="user" />
            <Table data={users} columns={columns} onEdit={usersEdit} />
        </div>
    );
}

export default UsersPage;