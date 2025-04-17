import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';

// Public Pages
import Register from './pages/Register';
import Login from './pages/Login';

// Lazy-loaded ITAM Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ITAMDashboard = lazy(() => import('./pages/ITAM/ITAMDashboard'));
const AssetListPage = lazy(() => import('./pages/ITAM/AssetListPage'));
const AssetDetailsPage = lazy(() => import('./pages/ITAM/AssetDetailsPage'));
const AssetFormPage = lazy(() => import('./pages/ITAM/AssetFormPage'));
const ITAMSettingsPage = lazy(() => import('./pages/ITAM/ITAMSettingsPage'));
const ITAMCustomSettingsPage = lazy(() => import('./pages/ITAM/ITAMCustomSettingsPage'));

import SidebarLayout from './components/SidebarLayout';

// --- Auth & Role Check ---
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role || '';
};

// --- Private Route Wrapper ---
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    localStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" />;
  }

  const userRole = getUserRole();

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <div>Unauthorized</div>;
  }

  return children;
};

// --- App Entry ---
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* ITAM Nested Routes with Sidebar */}
          <Route path="/itam" element={
            <PrivateRoute>
              <SidebarLayout />
            </PrivateRoute>
          }>
            <Route path="dashboard" element={<ITAMDashboard />} />
            <Route path="assets" element={<AssetListPage />} />
            <Route path="assets/new" element={<AssetFormPage />} />
            <Route path="assets/:id" element={<AssetDetailsPage />} />
            <Route path="assets/:id/edit" element={<AssetFormPage />} />
            <Route path="settings" element={<ITAMSettingsPage />} />
            <Route
              path="settings/custom"
              element={
                <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                  <ITAMCustomSettingsPage />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
