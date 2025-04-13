// Frontend/src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetListPage from './pages/ITAM/AssetListPage';
import AssetDetailsPage from './pages/ITAM/AssetDetailsPage';
import AssetFormPage from './pages/ITAM/AssetFormPage';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <div>
                <h1>Welcome to Project Inspiron 1</h1>
                <Routes>
                    {/* More specific routes first */}
                    <Route exact path="/assets/:id/edit" element={<AssetFormPage />} />
                    <Route exact path="/assets/:id" element={<AssetDetailsPage />} />
                    <Route exact path="/assets/new" element={<AssetFormPage />} />
                    <Route exact path="/assets" element={<AssetListPage />} />

                    {/* Original routes - use exact */}
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/dashboard" element={<Dashboard />} />
                    <Route exact path="/" element={<div>Home Page</div>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;