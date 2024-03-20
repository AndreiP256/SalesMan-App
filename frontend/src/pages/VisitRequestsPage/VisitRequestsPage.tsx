import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AddForm } from '../../components/EditAdd/addService';
import { checkAuth } from '../../components/checkAuth';
import { Navigate } from 'react-router-dom';

function VisitRequestPage() {
  const [visitRequests, setVisitRequests] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchClient, setSearchClient] = useState('');
  const [searchAgent, setSearchAgent] = useState('');

  const visitRequestDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:3001/visitRequest/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);

      if (authStatus) {
        try {
            const response = await axios.get(process.env.REACT_APP_URL + '/visitRequest');
            const visitRequests: any[] = await Promise.all(response.data.map(async (visitRequest: any) => {
                const clientResponse = await axios.get(process.env.REACT_APP_URL + '/clients/' + visitRequest.clientId);
                const userResponse = await axios.get(process.env.REACT_APP_URL + '/user/' + visitRequest.salesAgentId);
                return {
                    ...visitRequest,
                    clientName: clientResponse.data.companyName,
                    salesAgentName: userResponse.data.name,
                };
            }));
            console.log(visitRequests);
            setVisitRequests(visitRequests as never[]);
        } catch (error) {
            console.error(error);
        }
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or your own loading component
  }

  const columns = ['id', 'salesAgentId', 'clientId']; // replace with your actual columns
  const addColumns = [...columns];

  const filteredVisitRequests = visitRequests.filter(visitRequest => {
    const clientName = visitRequest.clientName.toLowerCase();
    const agentName = visitRequest.salesAgentName.toLowerCase();

    return clientName.includes(searchClient.toLowerCase()) && agentName.includes(searchAgent.toLowerCase());
  });

  return (
    <div>
      <h1>Visit Requests</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type="text" value={searchClient} onChange={(e) => setSearchClient(e.target.value)} placeholder="Search by client" style={{ marginRight: '20px' }}/>
          <input type="text" value={searchAgent} onChange={(e) => setSearchAgent(e.target.value)} placeholder="Search by agent"style={{ marginRight: '20px' }} />
          <AddForm columns={addColumns} addType="visitRequest" />
      </div>
      <ul className="calendar-events">
        {filteredVisitRequests.map((visitRequest: any, index: number) => (
            <li key={index} className="calendar-event">
            <h2 className="event-titlet">Client: {visitRequest.clientName}</h2>
            <p className="event-title">Status: {visitRequest.status}</p>
            <p className="event-title">Sales Agent: {visitRequest.salesAgentName}</p>
            <p className="event-time">Date: {new Date(visitRequest.startTime).toLocaleDateString()}</p>
            <button onClick={() => visitRequestDelete(visitRequest.id)} className='btn btn-danger my-button'>Delete</button>
            </li>
        ))}
        </ul>
    </div>
  );
}

export default VisitRequestPage;