
import React from 'react';
import ClientSidebar from './ClientSidebar';
import { useNavigate } from '../hooks/useNavigate';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { route } = useNavigate();
  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <ClientSidebar currentRoute={route} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ClientLayout;
