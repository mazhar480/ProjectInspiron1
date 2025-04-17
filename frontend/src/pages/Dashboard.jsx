import React from 'react'; 
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate(); // ✅ must be called inside component

  const handleLogout = () => {
    localStorage.removeItem('token');       // Clear JWT
    localStorage.removeItem('user');        // Optional
    navigate('/login');                     // Redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-blue-500 p-6 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">Inspiron 1</h1>
          <Link to="/itam/dashboard" className="hover:text-gray-200">
            ITAM
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-8 flex-grow">
        <p className="text-gray-700">Welcome to the dashboard! (Protected route)</p>
      </div>
    </div>
  );
}

export default Dashboard;
