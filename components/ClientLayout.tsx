
import React from 'react';
import ClientSidebar from './ClientSidebar';

interface ClientLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, currentRoute }) => {
  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <ClientSidebar currentRoute={currentRoute} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ClientLayout;
