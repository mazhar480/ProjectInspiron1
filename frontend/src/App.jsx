// Frontend/src/App.js

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Register from './pages/Register'; 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetListPage from './pages/ITAM/AssetListPage';
import AssetDetailsPage from './pages/ITAM/AssetDetailsPage';
import AssetFormPage from './pages/ITAM/AssetFormPage';
import ITAMDashboard from './pages/ITAM/ITAMDashboard';
import './index.css';

// Dummy authentication check (replace with actual auth logic)
const isAuthenticated = () => {
  // Check for the 'token' in localStorage
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists, false otherwise
};

 // PrivateRoute component for protected routes
 const PrivateRoute = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated()) {
        localStorage.setItem('redirectUrl', location.pathname);
        return <Navigate to="/login" />;
    }
    return children;
  };

function App() {
    return (
        <BrowserRouter>
            <div>
                <h1>Welcome to Project Inspiron 1</h1>
                 <Routes>
                    {/* Public Routes */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Routes */}
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    
                    {/* ITAM Routes */}
                    <Route path="/itam/dashboard" element={
                        <PrivateRoute>
                            <ITAMDashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/assets/:id/edit" element={<PrivateRoute><AssetFormPage /></PrivateRoute>} />
                    <Route path="/assets/:id" element={<PrivateRoute><AssetDetailsPage /></PrivateRoute>} />
                    <Route path="/assets/new" element={<PrivateRoute><AssetFormPage /></PrivateRoute>} />
                    <Route path="/assets" element={<PrivateRoute><AssetListPage /></PrivateRoute>} />
                    
                    {/* Default Route */}
                    <Route path="*" element={<div>404 Not Found</div>} />
                  </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;