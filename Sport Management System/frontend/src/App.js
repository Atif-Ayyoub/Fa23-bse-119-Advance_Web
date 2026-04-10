import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Items from './pages/Items';
import Issue from './pages/Issue';
import Return from './pages/Return';
import Reports from './pages/Reports';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <Router>
      <div className="app-container">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="app-body">
          {sidebarOpen && <Sidebar />}
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/items" element={<Items />} />
              <Route path="/issue" element={<Issue />} />
              <Route path="/return" element={<Return />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
