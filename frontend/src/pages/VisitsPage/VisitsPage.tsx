import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function VisitsPage() {
    const [visits, setVisits] = useState([]);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [error, setError] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        axios.get(process.env.REACT_APP_URL + '/visit')
            .then(response => setVisits(response.data))
            .catch(error => console.error(error));
    }, []);

    function openModal(visit: any) {
        setSelectedVisit(visit);
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
            <h1>Visits</h1>
            {renderTable(visits, ['id', 'clientId', 'meetingTime', 'conclusion', 'nextMeeting', 'invoice', 'visitCode', 'userId'])}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Visit Details"
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
                {selectedVisit && (
                    <div>
                        <h2>ID: {(selectedVisit as any).id}</h2>
                        <p>Meeting Time: {(selectedVisit as any).meetingTime}</p>
                        <p>Conclusion: {(selectedVisit as any).conclusion}</p>
                        <p>Next Meeting: {(selectedVisit as any).nextMeeting}</p>
                        <p>Invoice: {(selectedVisit as any).invoice}</p>
                        <p>Visit Code: {(selectedVisit as any).visitCode}</p>
                        <p>User ID: {(selectedVisit as any).userId}</p>
                    </div>
                )}
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
}

export default VisitsPage;