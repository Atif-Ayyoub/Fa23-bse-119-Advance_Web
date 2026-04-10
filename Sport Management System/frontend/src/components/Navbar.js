import React from 'react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="navbar-title">Sports Equipment Management</div>
      </div>
      <div className="navbar-right">
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </nav>
  );
};

export default Navbar;
