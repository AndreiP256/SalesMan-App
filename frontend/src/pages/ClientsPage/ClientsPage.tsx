// ClientsPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(process.env.REACT_APP_URL + '/clients')
      .then(response => setClients(response.data))
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
      <h1>Clients</h1>
      {renderTable(clients, ['id', 'description', 'companyName', 'taxCode', 'latitude', 'longitude', 'totalOrder', 'salesAgentId', 'clientCode'])}
    </div>
  );
}

export default ClientsPage;