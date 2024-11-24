import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Ranking from './components/Ranking';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ranking" element={<Ranking />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
