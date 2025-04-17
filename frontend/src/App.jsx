import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Register from './pages/Register'; 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetListPage from './pages/ITAM/AssetListPage';
import AssetDetailsPage from './pages/ITAM/AssetDetailsPage';
import AssetFormPage from './pages/ITAM/AssetFormPage';
import ITAMDashboard from './pages/ITAM/ITAMDashboard';
import ITAMSettingsPage from './pages/ITAM/ITAMSettingsPage';
import SidebarLayout from './components/SidebarLayout';
import './index.css';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

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
      <Routes>
  {/* Public Routes */}
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />

  {/* Protected Routes */}
  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

  {/* ITAM with Sidebar Layout */}
  <Route path="/itam" element={<PrivateRoute><SidebarLayout /></PrivateRoute>}>
    <Route path="dashboard" element={<ITAMDashboard />} />
    <Route path="assets" element={<AssetListPage />} />
    <Route path="assets/new" element={<AssetFormPage />} />
    <Route path="assets/:id" element={<AssetDetailsPage />} />
    <Route path="assets/:id/edit" element={<AssetFormPage />} />
     <Route path="settings" element={<ITAMSettingsPage />} />
  </Route>

  {/* Fallback */}
  <Route path="*" element={<div>404 Not Found</div>} />
</Routes>

    </BrowserRouter>
  );
}

export default App;
