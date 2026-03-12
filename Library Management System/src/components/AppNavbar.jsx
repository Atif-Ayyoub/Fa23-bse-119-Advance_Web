import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/books', label: 'Books' },
  { to: '/members', label: 'Members' },
  { to: '/borrow-records', label: 'Borrowed Books' },
  { to: '/books/new', label: 'Add Book' },
  { to: '/members/new', label: 'Add Member' },
];

function AppNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top">
      <div className="container-fluid px-3 px-md-4 px-xl-5">
        <NavLink className="navbar-brand fw-semibold" to="/">
          Library Management System
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'text-info fw-semibold' : ''}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
