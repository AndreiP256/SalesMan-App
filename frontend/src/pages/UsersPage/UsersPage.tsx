import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersPage.css';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(process.env.REACT_APP_URL + '/user')
      .then(response => setUsers(response.data))
      .catch(error => setError(error.message));
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

const renderTable = (data: any[], columns: string[]) => (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} onClick={() => setSelectedUser(item)} className={selectedUser === item ? 'selected' : ''}>
            {columns.map((column) => (
              <td key={column}>{item[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h1>Users</h1>
      {renderTable(users, ['id', 'name', 'phone', 'role', 'agentCode'])}
    </div>
  );
}

export default UsersPage;