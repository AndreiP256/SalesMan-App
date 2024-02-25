import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './UsersPage.css';

Modal.setAppElement('#root'); // This line is needed for accessibility reasons

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.get(process.env.REACT_APP_URL + '/user')
      .then(response => setUsers(response.data))
      .catch(error => setError(error.message));
  }, []);

function openModal(user: any) {
    setSelectedUser(user);
    setIsOpen(true);
}

function closeModal() {
    setIsOpen(false);
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
          <tr key={index} onClick={() => openModal(item)} className={selectedUser === item ? 'selected' : ''}>
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="User Details"
        style={{
            overlay: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              position: 'relative',
              top: 'auto',
              left: 'auto',
              right: 'auto',
              bottom: 'auto',
              maxWidth: '400px',
              minWidth: '300px',
              maxHeight: '500px',
              minHeight: '300px',
              overflow: 'auto',
              padding: '20px',
              borderRadius: '4px',
              outline: 'none',
            },
          }}
      >
        {selectedUser && (
            <div className='modal-content'>
                <h2>Name: {(selectedUser as { name: string }).name}</h2>
                <p>Phone: {(selectedUser as { phone: string }).phone}</p>
                <p>Role: {(selectedUser as { role: string }).role}</p>
                <p>Agent Code: {(selectedUser as { agentCode: string }).agentCode}</p>
            </div>
        )}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default UsersPage;