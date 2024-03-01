import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';


Modal.setAppElement('#root');

interface TableProps {
    columns: string[];
    data: any[];
    onEdit: (client: any) => void;
    onDelete: (client: any) => void;
}

function Table({ columns, data, onEdit, onDelete }: TableProps) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedClient, setEditedClient] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const uneditableColumns = ['id'];
    const [message, setMessage] = useState('');
    const [saleAgents, setSalesAgents] = useState('');
    const [clients, setClients] = useState('');

    

    function openModal(client: any) {
        setSelectedClient(client);
        setEditedClient({ ...client });
        setMessage('');
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setIsEditing(false);
    }

    function handleEdit() {
        try {
            const { meetingTimeDate, nextMeetingDate, ...dataToSend } = editedClient;
            onEdit(dataToSend);
            setIsEditing(false);
            setIsOpen(false);
        } catch (err) {
            setError((err as Error).message);
            setMessage(`Error editing client.`);
        }
    }

    function handleDelete() {
        try {
            onDelete(selectedClient);
            setIsOpen(false);
        } catch (err) {
            setError((err as Error).message);
            setMessage(`Error deleting client.`);
        }
    }

    const renderTable = (data: any[]) => (
        <table>
            <thead>
                <tr>
                    {columns.map(column => <th key={column}>{column}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map(row => (
                    <tr key={row.id} onClick={() => openModal(row)}>
                        {columns.map(column => <td key={column}>{row[column]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    useEffect(() => {
        axios.get(process.env.REACT_APP_URL + '/user')
            .then(response => {
                setSalesAgents(response.data);
            })
            .catch(error => console.error(error));

        axios.get(process.env.REACT_APP_URL + '/clients')
            .then(response => {
                setClients(response.data);
            })
            .catch(error => console.error(error));
    
    }, []);

    return (
        <div>
            {renderTable(data)}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Client Details"
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
                        maxHeight: '500px',
                        overflow: 'auto',
                        padding: '20px',
                        borderRadius: '4px',
                        outline: 'none',
                    },
                }}
            >
                {message && <p>{message}</p>}
                {selectedClient && !isEditing && columns.map(column => (
  <p key={column}>{column}: {(selectedClient as any)[column]}</p>
))}
{isEditing && columns.map(column => (
    uneditableColumns.includes(column) ? (
        <p key={column}>{column}: {(editedClient as any)[column]}</p>
    ) : (
  <div key={column} className='need-padding'>
    <label>{column}:</label>
    {column === 'role' ? (
      <select
        value={(editedClient as any)[column]}
        onChange={(e) => setEditedClient({ ...editedClient, [column]: e.target.value })}
      >
        <option value="MANAGER">MANAGER</option>
        <option value="DRIVER">DRIVER</option>
        <option value="SALES_AGENT">SALES_AGENT</option>
        {/* Add more options as needed */}
      </select>
    ) : column === 'meetingTime' || column == "nextMeeting"  ? (
        <>
        <input
            type="date"
            value={(editedClient as any)[`${column}Date`]}
            onChange={(e) => {
                const date = e.target.value;
                setEditedClient((prevState: any) => ({
                ...prevState,
                [`${column}Date`]: date
                }));
            }}
        />
        <input
            type="time"
            value={(editedClient as any)[`${column}Time`]}
            onChange={(e) => {
                const time = e.target.value;
                setEditedClient((prevState: any) => ({
                    ...prevState,
                    [column]: `${(prevState as any)[`${column}Date`] || '1970-01-01'}T${time}:00.000Z`
                }));
            }}
        />
        </>
      ) : (column === 'salesAgentId') ? (
        <select
            value={(editedClient as any)[column]}
            onChange={(e) => setEditedClient({...editedClient, [column]: e.target.value})}
        >
            <option value=''>-</option>
            {Array.isArray(saleAgents) && saleAgents.filter((agent: any) => agent.role === 'SALES_AGENT').map((agent: any) => (
                <option key={agent.id} value={agent.id}>
                    {agent.name}
                </option>
            ))}
        </select>
    ) : ( column === 'clientId') ? (
        <select
            value={(editedClient as any)[column]}
            onChange={(e) => setEditedClient({...editedClient, [column]: e.target.value})}
        >
            <option value=''>-</option>
            {Array.isArray(clients) && clients.map((client: any) => (
                <option key={client.id} value={client.id}>
                    {client.companyName}
                </option>
            ))}
        </select>
    ) : (column === 'userId') ? (
        <select
        value={(editedClient as any)[column]}
        onChange={(e) => setEditedClient({...editedClient, [column]: e.target.value})}
      >
        <option value=''>-</option>
        {Array.isArray(saleAgents) && saleAgents.map((salesAgent: any) => (
          <option key={salesAgent.id} value={salesAgent.id}>
            {salesAgent.name} {/* Replace 'name' with the appropriate property of the salesAgent object */}
          </option>
        ))}
      </select>
    ) : (
      <input
        value={(editedClient as any)[column]}
        onChange={(e) => setEditedClient({ ...editedClient, [column]: e.target.value })}
      />
    )}
  </div>
))
)}
<button className="btn btn-secondary my-button" onClick={closeModal}>Close</button>
{!isEditing && <button className="btn btn-primary my-button" onClick={() => setIsEditing(true)}>Edit</button>}
{isEditing && <button className="btn btn-success my-button" onClick={handleEdit}>Save</button>}
{!isEditing && <button className='btn btn-danger my-button' onClick={handleDelete}>Delete</button>}
{error && <p>Error: {error}</p>}
</Modal>
        </div>
    );
}

export default Table;