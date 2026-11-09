import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { Accounts } from '../pages/Accounts';
import { EmailExplorer } from '../pages/EmailExplorer';
import { ClassificationAnalytics } from '../pages/ClassificationAnalytics';
import { PipelineMonitoring } from '../pages/PipelineMonitoring';
import { Settings } from '../pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
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
