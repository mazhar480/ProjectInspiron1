import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate(); // ✅ must be called inside component

  const handleLogout = () => {
    localStorage.removeItem('token');       // Clear JWT
    localStorage.removeItem('user');        // Optional
    navigate('/login');                     // Redirect to login
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
      <p>Welcome to the dashboard! (Protected route)</p>
    </div>
  );
}

export default Dashboard;
