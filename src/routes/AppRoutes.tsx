import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { Accounts } from '../pages/Accounts';
import { EmailExplorer } from '../pages/EmailExplorer';
import { ClassificationAnalytics } from '../pages/ClassificationAnalytics';
import { PipelineMonitoring } from '../pages/PipelineMonitoring';
import { Settings } from '../pages/Settings';
import { Login } from '../pages/Login';
import { useAuth } from '../context/AuthContext';

export const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={user ? <AppLayout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/emails" element={<EmailExplorer />} />
        <Route path="/analytics" element={<ClassificationAnalytics />} />
        <Route path="/pipeline" element={<PipelineMonitoring />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
