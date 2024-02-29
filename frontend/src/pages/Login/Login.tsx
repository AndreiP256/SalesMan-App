import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
    const [agentCode, setAgentCode] = useState('');
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
            localStorage.setItem('token', data.token);
            // Redirect the user to the main page
        } else {
            // Show an error message
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
            </form>
        </div>
    );
}

export default LoginPage;