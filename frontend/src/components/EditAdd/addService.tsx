import React, { useState } from 'react';
import Modal from 'react-modal';

interface AddFormProps {
    columns: string[];
    addType: string;
  }
  

export const AddForm = ({columns, addType }: AddFormProps) => {
    const [formData, setFormData] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const uneditableColumns = ['id'];
    const [message, setMessage] = useState('');

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

    return (
        <div>
            <button onClick={() => {
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
                                        <option value="MANAGER">MANAGER</option>
                                        <option value="DRIVER">DRIVER</option>
                                        <option value="SALES_AGENT">SALES_AGENT</option>
                                        {/* Add more options as needed */}
                                    </select>
                                
                                ) : (column === 'meetingTime' || column == "nextMeeting") ? (
                                    <input
                                        type="date"
                                        value={(formData as any)[column]}
                                        onChange={(e) => setFormData({ ...formData, [column]: e.target.value })}
                                    />
                                ) : (
                                    <input
                                        value={(formData as any)[column]}
                                        onChange={(e) => setFormData({ ...formData, [column]: e.target.value })}
                                    />
                                )}
                            </div>
                        )
                    ))}
                    <button type="submit">Add User</button>
                </form>
            </Modal>
        </div>
    );
};
