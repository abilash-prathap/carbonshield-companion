import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import SubmitTask from './pages/SubmitTask';
import MyTasks from './pages/MyTasks';
import GreenPoints from './pages/GreenPoints';
import Analytics from './pages/Analytics';
import GridStatus from './pages/GridStatus';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="submit" element={<SubmitTask />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="points" element={<GreenPoints />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="grid" element={<GridStatus />} />
            <Route path="settings" element={<Settings />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
