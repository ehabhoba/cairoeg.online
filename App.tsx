
import React, { useState, useEffect } from 'react';
import { NotificationProvider } from './providers/NotificationProvider';

// Layouts
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import DashboardLayout from './components/DashboardLayout';

// Main Pages
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import PaymentsPage from './pages/PaymentsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

// Service Pages
import MarketingPage from './pages/Services/MarketingPage';
import GraphicDesignPage from './pages/Services/GraphicDesignPage';
import WebDesignPage from './pages/Services/WebDesignPage';

// Dashboard Pages
import AnalyticsPage from './pages/AnalyticsPage';
import ClientsPage from './pages/ClientsPage';
import AssistantPage from './pages/AssistantPage';


const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPublicPage = () => {
    const [baseRoute, slug] = route.split('/');
    switch (baseRoute) {
      case '#': return <HomePage />;
      case '#services':
        switch (slug) {
            case 'marketing': return <MarketingPage />;
            case 'graphic-design': return <GraphicDesignPage />;
            case 'web-design': return <WebDesignPage />;
            default: return <HomePage />;
        }
      case '#pricing': return <PricingPage />;
      case '#portfolio': return <PortfolioPage />;
      case '#about': return <AboutPage />;
      case '#contact': return <ContactPage />;
      case '#login': return <LoginPage />;
      case '#payments': return <PaymentsPage />;
      case '#blog': 
        return slug ? <BlogPostPage slug={slug} /> : <BlogPage />;
      default: return <HomePage />;
    }
  };
  
  const renderDashboardPage = () => {
      const [baseRoute, page] = route.split('/');
      switch (page) {
          case 'analytics': return <AnalyticsPage />;
          case 'clients': return <ClientsPage />;
          case 'assistant': return <AssistantPage />;
          default: return <AnalyticsPage />; // Default to analytics
      }
  };
  
  const isDashboardRoute = route.startsWith('#/dashboard');

  return (
    <NotificationProvider>
        {isDashboardRoute ? (
            <DashboardLayout currentRoute={route}>
                {renderDashboardPage()}
            </DashboardLayout>
        ) : (
            <div className="flex flex-col min-h-screen font-sans bg-dark-bg text-slate-300">
                <TopNav currentRoute={route} />
                <main className="flex-grow">
                    <div key={route} className="animate-fade-in">
                        {renderPublicPage()}
                    </div>
                </main>
                <FloatingWhatsAppButton />
                <Footer />
            </div>
        )}
    </NotificationProvider>
  );
};

export default App;
