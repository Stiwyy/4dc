import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </HashRouter>
    );
}

export default App;