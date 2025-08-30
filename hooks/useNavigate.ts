
import { useContext } from 'react';
import { NavigationContext } from '../providers/NavigationProvider';

export const useNavigate = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigate must be used within a NavigationProvider');
  }
  return context;
};
