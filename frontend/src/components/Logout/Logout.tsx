import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <button className="btn btn-primary mr-3" style={{"marginRight": "10px"}} onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;