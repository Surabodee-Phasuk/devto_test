import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" className="nav-item">Home</NavLink>
        <NavLink to="/content" className="nav-item">Content</NavLink>
        <NavLink to="/member" className="nav-item">Member</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
