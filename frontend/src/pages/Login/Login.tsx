import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { set } from 'date-fns';

function LoginPage() {
    const navigate = useNavigate();
    const [agentCode, setAgentCode] = useState('');
    const [error, setError] = useState<string | null>(''); // [1
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch(process.env.REACT_APP_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ agentCode }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data);
            localStorage.setItem('token', data.access_token);
            setError(null); // [2]
            navigate('/users'); // [3]
        } else {
            setError(data.message); 
        }
    };

    return (
        <div className="container">
            <form className="mt-5" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="agentCode">Agent Code:</label>
                    <input
                        type="text"
                        id="agentCode"
                        className="form-control"
                        value={agentCode}
                        onChange={(e) => setAgentCode(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
                {error && <div className="alert alert-danger">{error}</div>}
            </form>
        </div>
    );
}

export default LoginPage;