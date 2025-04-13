
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './index.css'; // Import Tailwind styles

function App() {
    return (
        <BrowserRouter>
            <div>
                <h1>Welcome to Project Inspiron 1</h1>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;