import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import ProjectDetails from './pages/ProjectDetails';
import Backlog from './pages/Backlog';

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Today />} />
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
