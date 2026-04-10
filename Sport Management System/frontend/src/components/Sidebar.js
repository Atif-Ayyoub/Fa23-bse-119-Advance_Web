import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className={isActive('/')}>
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/students" className={isActive('/students')}>
            👨‍🎓 Students
          </Link>
        </li>
        <li>
          <Link to="/items" className={isActive('/items')}>
            🏏 Equipment
          </Link>
        </li>
        <li>
          <Link to="/issue" className={isActive('/issue')}>
            📤 Issue Items
          </Link>
        </li>
        <li>
          <Link to="/return" className={isActive('/return')}>
            📥 Return Items
          </Link>
        </li>
        <li>
          <Link to="/reports" className={isActive('/reports')}>
            📊 Reports
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
