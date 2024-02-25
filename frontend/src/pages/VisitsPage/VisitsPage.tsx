import { useEffect, useState } from "react";
import axios from "axios";

function VisitsPage() {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      <h1>Visits</h1>
      {renderTable(visits, ['id', 'clientId', 'meetingTime', 'conclusion', 'nextMeeting', 'invoice', 'visitCode', 'userId'])}
    </div>
  );
}

export default VisitsPage;