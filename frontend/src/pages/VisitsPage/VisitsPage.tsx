import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './../../components/Table/Table';
import { visitsEdit } from '../../components/EditAdd/editService';
import { AddForm } from '../../components/EditAdd/addService';

function VisitsPage() {
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        axios.get(process.env.REACT_APP_URL + '/visit')
            .then(response => {
                setVisits(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    const columns = ['id', 'clientId', 'meetingTime', 'conclusion', 'nextMeeting', 'invoice', 'visitCode', 'userId']; // replace with your actual columns

    return (
        <div>
            <h1>Visits</h1>
            <AddForm columns={columns} addType="visit"/>
            <Table data={visits} columns={columns} onEdit={visitsEdit}/>
        </div>
    );
}

export default VisitsPage;