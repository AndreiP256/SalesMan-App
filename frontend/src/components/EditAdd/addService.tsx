import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';


interface AddFormProps {
    columns: string[];
    addType: string;
  }
  

export const AddForm = ({columns, addType }: AddFormProps) => {
    const [formData, setFormData] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const uneditableColumns = ['id'];
    const [message, setMessage] = useState('');
    const [saleAgents, setSalesAgents] = useState('');
    const [clients, setClients] = useState('');

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        let apiEndpoint = '';
    
        switch(addType) {
            case 'user':
                apiEndpoint = '/user';
                break;
            case 'client':
                apiEndpoint = '/clients';
                break;
            case 'visit':
                apiEndpoint = '/visit';
                break;
            default:
                console.error('Invalid addType');
                return;
        }
    
        try {
            console.log(formData);
            const response = await fetch(process.env.REACT_APP_URL + apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
            setMessage(`New ${addType} created successfully!`); // Set the message when something new is created
            setModalIsOpen(false);
        } catch (error) {
            console.error('Error:', error);
            setMessage(`Error creating new ${addType}.`);
        }
    };

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
            <button className="btn btn-primary"  onClick={() => {
                setFormData({});
                setMessage('');
                setModalIsOpen(true)
                }}>Add</button>
            <Modal 
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
            isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                { message && <p>{message}</p> }
                <form onSubmit={handleSubmit}>
                    {columns.map((column: string) => (
                        uneditableColumns.includes(column) ? (
                            <p key={column}>{column}: {(formData as any)[column]}</p>
                        ) : (
                            <div key={column}>
                                <label>{column}:</label>
                                {column === 'role' ? (
                                    <select
                                        value={(formData as any)[column]}
                                        onChange={(e) => setFormData({ ...formData, [column]: e.target.value })}
                                    >
                                        <option value="">-</option>
                                        <option value="MANAGER">MANAGER</option>
                                        <option value="DRIVER">DRIVER</option>
                                        <option value="SALES_AGENT">SALES_AGENT</option>
                                        {/* Add more options as needed */}
                                    </select>
                                
                                ) : (column === 'meetingTime' || column == "nextMeeting") ? (
                                    <>
                                    <input
                                        type="date"
                                        value={(formData as any)[`${column}Date`]}
                                        onChange={(e) => {
                                        const date = e.target.value;
                                        setFormData(prevState => ({
                                            ...prevState,
                                            [column]: `${date}T${(prevState as any)[`${column}Time`] || '00:00:00.000'}Z`
                                        }));
                                        }}
                                    />
                                    <input
                                        type="time"
                                        value={(formData as any)[`${column}Time`]}
                                        onChange={(e) => {
                                        const time = e.target.value;
                                        setFormData(prevState => ({
                                            ...prevState,
                                            [column]: `${(prevState as any)[`${column}Date`] || '1970-01-01'}T${time}:00.000Z`
                                        }));
                                        }}
                                    />
                                    </>
                                ) : (column === 'salesAgentId') ? (
                                    <select
                                        value={(formData as any)[column]}
                                        onChange={(e) => setFormData({...formData, [column]: e.target.value})}
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
                                        value={(formData as any)[column]}
                                        onChange={(e) => setFormData({...formData, [column]: e.target.value})}
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
                                    value={(formData as any)[column]}
                                    onChange={(e) => setFormData({...formData, [column]: e.target.value})}
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
                                        value={(formData as any)[column]}
                                        onChange={(e) => setFormData({ ...formData, [column]: e.target.value })}
                                    />
                                )
                                 } </div>
                        )
                    ))}
                    <button className="btn btn-success my-button"  type="submit">Add</button>
                    <button className="btn btn-danger my-button"  onClick={closeModal}>Close</button>
                </form>
            </Modal>
        </div>
    );
};
