import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
}