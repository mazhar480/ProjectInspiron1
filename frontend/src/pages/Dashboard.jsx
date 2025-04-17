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
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-blue-800 p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Inspiron 1</h1> 
          <Link to="/itam/dashboard" className="hover:text-gray-300">
            ITAM
          </Link>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <p>Welcome to the dashboard! (Protected route)</p>
      </div>

    </div>
  );
}

export default Dashboard;
