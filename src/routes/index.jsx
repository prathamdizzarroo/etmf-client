import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import DocumentMap from '../components/forms/DocumentMap';
import Reports from '../components/Reports';
import Settings from '../components/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<div>Dashboard Content</div>} />
        <Route path="studies">
          <Route path="active" element={<div>Active Studies</div>} />
          <Route path="completed" element={<div>Completed Studies</div>} />
        </Route>
        <Route path="documents">
          <Route path="recent" element={<DocumentMap />} />
          <Route path="templates" element={<div>Document Templates</div>} />
        </Route>
        <Route path="operations">
          <Route path="workflows" element={<div>Workflows</div>} />
          <Route path="tasks" element={<div>Tasks</div>} />
        </Route>
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 