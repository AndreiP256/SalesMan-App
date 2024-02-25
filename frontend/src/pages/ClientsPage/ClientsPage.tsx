import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        axios.get(process.env.REACT_APP_URL + '/clients')
            .then(response => setClients(response.data))
            .catch(error => console.error(error));
    }, []);

    function openModal(client: any) {
        setSelectedClient(client);
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const renderTable = (data: any[], columns: string[]) => (
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
            <h1>Clients</h1>
            {renderTable(clients, ['id', 'description', 'companyName', 'taxCode', 'latitude', 'longitude', 'totalOrder', 'salesAgentId', 'clientCode'])}
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
                {selectedClient && (
                    <div>
                        <h2>ID: {(selectedClient as any).id}</h2>
                        <p>Description: {(selectedClient as any).description}</p>
                        <p>Company Name: {(selectedClient as any).companyName}</p>
                        <p>Tax Code: {(selectedClient as any).taxCode}</p>
                        <p>Latitude: {(selectedClient as any).latitude}</p>
                        <p>Longitude: {(selectedClient as any).longitude}</p>
                        <p>Total Order: {(selectedClient as any).totalOrder}</p>
                        <p>Sales Agent ID: {(selectedClient as any).salesAgentId}</p>
                        <p>Client Code: {(selectedClient as any).clientCode}</p>
                    </div>
                )}
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
}

export default ClientsPage;