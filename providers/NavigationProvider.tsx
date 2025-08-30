
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface NavigationContextType {
  route: string;
  navigate: (path: string) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState(window.location.pathname);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
      window.scrollTo(0, 0);
    };

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      if (
        anchor &&
        anchor.origin === window.location.origin &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey &&
        anchor.target !== '_blank'
      ) {
        event.preventDefault();
        const newRoute = anchor.pathname + anchor.search + anchor.hash;
        if (newRoute !== window.location.pathname + window.location.search + window.location.hash) {
          navigate(newRoute);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
    };
  }, [navigate]);

  return (
    <NavigationContext.Provider value={{ route, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};
