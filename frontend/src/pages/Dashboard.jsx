import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Boxes } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-blue-500 p-6 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">Inspiron 1</h1>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hover:text-gray-200 flex items-center space-x-2 ${
                isActive ? 'underline font-semibold' : ''
              }`
            }
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/itam/dashboard"
            className={({ isActive }) =>
              `hover:text-gray-200 flex items-center space-x-2 ${
                isActive ? 'underline font-semibold' : ''
              }`
            }
          >
            <Boxes />
            <span>ITAM</span>
          </NavLink>
        </div>

        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-8 flex-grow">
        <p className="text-gray-700">Welcome to the dashboard! (Protected route)</p>
      </div>
    </div>
  );
}

export default Dashboard;
