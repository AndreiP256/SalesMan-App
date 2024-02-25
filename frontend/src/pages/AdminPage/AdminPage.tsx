import './AdminPage.css';

import {useEffect, useState} from "react";
import axios from "axios";
import searchLogo from "../../images/search-logo.svg";
import danger from "../../images/danger.svg";
import imageMargin from "../../images/image-margin.png";
import backButton from "../../images/back-button.svg";
import {useMediaQuery} from "react-responsive";


function AdminPage() {
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [visits, setVisits] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios.get(process.env.REACT_APP_URL + '/user')
        .then(response => setUsers(response.data))
        .catch(error => setError(error.message));
  
      axios.get(process.env.REACT_APP_URL + '/clients')
        .then(response => setClients(response.data))
        .catch(error => setError(error.message));
  
      axios.get(process.env.REACT_APP_URL + '/visit')
        .then(response => setVisits(response.data))
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
              <tr key={index}>
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
          <h1>Clients</h1>
          {renderTable(clients, ['id', 'description', 'companyName', 'taxCode', 'latitude', 'longitude', 'totalOrder', 'salesAgentId', 'clientCode'])}
          <h1>Visits</h1>
          {renderTable(visits, ['id', 'clientId', 'meetingTime', 'conclusion', 'nextMeeting', 'invoice', 'visitCode', 'userId'])}
        </div>
      );
    }

export default AdminPage;
