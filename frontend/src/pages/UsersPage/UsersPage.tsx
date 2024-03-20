import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';
import { usersEdit } from '../../components/EditAdd/editService';
import { AddForm } from '../../components/EditAdd/addService';
import { usersDelete } from '../../components/EditAdd/deleteService';
import { checkAuth } from '../../components/checkAuth';
import { Navigate } from 'react-router-dom';

function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [search , setSearch] = useState('');
  
    useEffect(() => {
        console.log(localStorage.getItem('token'));
        const checkAuthentication = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);

            if (authStatus) {
                try {
                    const response = await axios.get(process.env.REACT_APP_URL + '/user');
                    setUsers(response.data);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        checkAuthentication();
    }, []);

    if (isAuthenticated === false) {
        return <Navigate to="/login" replace />;
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or your own loading component
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    // Rest of your UsersPage component code

    const columns = ['id', 'name', 'phone', 'role']; // replace with your actual columns
    const addColumns = [...columns, 'agentCode'];
    return (
        <div>
            <h1>Users</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="text" value={search} onChange={handleSearch} placeholder="Search users..." style={{ marginRight: '20px' }} />
                <AddForm columns={addColumns} addType="user" />
            </div>
            <Table data={filteredUsers} columns={columns} onEdit={usersEdit} onDelete={usersDelete}/>
        </div>
    );
}

export default UsersPage;