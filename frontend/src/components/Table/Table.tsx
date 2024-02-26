import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface TableProps {
    columns: string[];
    data: any[];
}

function Table({ columns, data }: TableProps) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    

    function openModal(client: any) {
        setSelectedClient(client);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
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
                {selectedClient && columns.map(column => (
                    <p key={column}>{column}: {(selectedClient as any)[column]}</p>
                ))}
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
}

export default Table;