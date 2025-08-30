
import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from '../hooks/useNavigate';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { route } = useNavigate();
  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar currentRoute={route} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* You can add a dashboard-specific header here if needed */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;