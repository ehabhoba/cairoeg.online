
import React, { useState, useEffect } from 'react';
import { NotificationProvider } from './providers/NotificationProvider';
import { blogPosts } from './data/siteData';

// Layouts
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import DashboardLayout from './components/DashboardLayout';
import ClientLayout from './components/ClientLayout';

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
import AdCreationPage from './pages/Services/AdCreationPage';

// Admin Dashboard Pages
import AnalyticsPage from './pages/AnalyticsPage';
import ClientsPage from './pages/ClientsPage';
import AssistantPage from './pages/AssistantPage';

// Client Portal Pages
import ClientDashboardPage from './pages/client/ClientDashboardPage';
import ClientProjectsPage from './pages/client/ClientProjectsPage';
import ClientInvoicesPage from './pages/client/ClientInvoicesPage';
import ClientSupportPage from './pages/client/ClientSupportPage';


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

  useEffect(() => {
    const getPageTitle = (path: string): string => {
        const baseTitle = "إعلانات القاهرة | Cairoeg";
        if (!path || path === '#/') return baseTitle;

        const [baseRoute, slug] = path.substring(2).split('/');
        
        switch (baseRoute) {
            case '': return baseTitle;
            case 'services':
                switch (slug) {
                    case 'marketing': return `التسويق الرقمي - ${baseTitle}`;
                    case 'graphic-design': return `التصميم الجرافيكي - ${baseTitle}`;
                    case 'web-design': return `تصميم المواقع - ${baseTitle}`;
                    case 'ad-creation': return `إنشاء الإعلانات - ${baseTitle}`;
                    default: return `الخدمات - ${baseTitle}`;
                }
            case 'pricing': return `الباقات - ${baseTitle}`;
            case 'portfolio': return `أعمالنا - ${baseTitle}`;
            case 'about': return `من نحن - ${baseTitle}`;
            case 'contact': return `تواصل معنا - ${baseTitle}`;
            case 'login': return `تسجيل الدخول - ${baseTitle}`;
            case 'payments': return `طرق الدفع - ${baseTitle}`;
            case 'blog': 
                if (slug) {
                    const post = blogPosts.find(p => p.slug === slug);
                    return post ? `${post.title} - ${baseTitle}` : `المدونة - ${baseTitle}`;
                }
                return `المدونة - ${baseTitle}`;
            case 'dashboard':
                return `لوحة التحكم - ${baseTitle}`;
            case 'client':
                return `بوابة العميل - ${baseTitle}`;
            default: return baseTitle;
        }
    }
    document.title = getPageTitle(route);
  }, [route]);

  const renderPublicPage = () => {
    const [baseRoute, slug] = route.split('/');
    switch (baseRoute) {
      case '#': return <HomePage />;
      case '#services':
        switch (slug) {
            case 'marketing': return <MarketingPage />;
            case 'graphic-design': return <GraphicDesignPage />;
            case 'web-design': return <WebDesignPage />;
            case 'ad-creation': return <AdCreationPage />;
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
      const page = route.split('/')[2];
      switch (page) {
          case 'analytics': return <AnalyticsPage />;
          case 'clients': return <ClientsPage />;
          case 'assistant': return <AssistantPage />;
          default: return <AnalyticsPage />;
      }
  };

  const renderClientPortalPage = () => {
      const page = route.split('/')[2];
      switch(page) {
          case 'dashboard': return <ClientDashboardPage />;
          case 'projects': return <ClientProjectsPage />;
          case 'invoices': return <ClientInvoicesPage />;
          case 'support': return <ClientSupportPage />;
          default: return <ClientDashboardPage />;
      }
  }
  
  const isDashboardRoute = route.startsWith('#/dashboard');
  const isClientPortalRoute = route.startsWith('#/client');

  const renderContent = () => {
    if (isDashboardRoute) {
      return (
        <DashboardLayout currentRoute={route}>
          {renderDashboardPage()}
        </DashboardLayout>
      );
    }
    if (isClientPortalRoute) {
        return (
            <ClientLayout currentRoute={route}>
                {renderClientPortalPage()}
            </ClientLayout>
        );
    }
    return (
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
    );
  };

  return (
    <NotificationProvider>
        {renderContent()}
    </NotificationProvider>
  );
};

export default App;
