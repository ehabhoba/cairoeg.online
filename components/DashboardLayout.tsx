
import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentRoute }) => {
  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar currentRoute={currentRoute} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* You can add a dashboard-specific header here if needed */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
