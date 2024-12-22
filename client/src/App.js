import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout';
import Today from './pages/Today';
import Dashboard from './pages/Dashboard';
import Upcoming from './pages/Upcoming';
import ProjectDetails from './pages/ProjectDetails';
import Backlog from './pages/Backlog';
import CalendarView from './pages/CalendarView';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/today" element={<Today />} />
                    <Route path="/upcoming" element={<Upcoming />} />
                    <Route path="/backlog" element={<Backlog />} />
                    <Route path="/project/:id" element={<ProjectDetails />} />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
