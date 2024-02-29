import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LogoutButton from '../../components/Logout/Logout';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/users" className="navbar-link">Users</Link>
        <Link to="/visits" className="navbar-link">Visits</Link>
        <Link to="/clients" className="navbar-link">Clients</Link>
        <Link to="/calendar" className="navbar-link">Calendar</Link>
      </div>
      <LogoutButton />
    </nav>
  );
}

export default Navbar;