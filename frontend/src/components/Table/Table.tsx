import React, { useState } from 'react';
import Modal from 'react-modal';


Modal.setAppElement('#root');

interface TableProps {
    columns: string[];
    data: any[];
    onEdit: (client: any) => void;
}

function Table({ columns, data, onEdit }: TableProps) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedClient, setEditedClient] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const uneditableColumns = ['id', 'clientId'];
    const [message, setMessage] = useState('');

    

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
            onEdit(editedClient);
            setIsEditing(false);
            setIsOpen(false);
        } catch (err) {
            setError((err as Error).message);
            setMessage(`Error editing client.`);
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
  <div key={column}>
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
      <input
        type="date"
        value={(editedClient as any)[column]}
        onChange={(e) => setEditedClient({ ...editedClient, [column]: e.target.value })}
      />
    ) : (
      <input
        value={(editedClient as any)[column]}
        onChange={(e) => setEditedClient({ ...editedClient, [column]: e.target.value })}
      />
    )}
  </div>
))
)}
<button onClick={closeModal}>Close</button>
{!isEditing && <button onClick={() => setIsEditing(true)}>Edit</button>}
{isEditing && <button onClick={handleEdit}>Save</button>}
{error && <p>Error: {error}</p>}
</Modal>
        </div>
    );
}

export default Table;