




import React, { useEffect } from 'react';
import { getPostBySlug } from './data/blogData';
import { useAuth } from './hooks/useAuth';
import { findUserByPhone, findUserById } from './data/userData';
import { getAdById } from './data/adsData';
import { useNavigate } from './hooks/useNavigate';

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
import ServicesPage from './pages/ServicesPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PublishArticlePage from './pages/PublishArticlePage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import PortfolioClientPage from './pages/PortfolioClientPage';
import PlatformGuidePage from './pages/PlatformGuidePage';
import AdsShowcasePage from './pages/AdsShowcasePage';

// Service Pages
import MarketingPage from './pages/Services/MarketingPage';
import GraphicDesignPage from './pages/Services/GraphicDesignPage';
import WebDesignPage from './pages/Services/WebDesignPage';
import AdCreationPage from './pages/Services/AdCreationPage';

// Admin Dashboard Pages
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ArticleManagerPage from './pages/ArticleManagerPage';
import CommentManagerPage from './pages/CommentManagerPage';
import AIStudioPage from './pages/AIStudioPage';
import RequestsManagerPage from './pages/dashboard/RequestsManagerPage';
import ContentAutomatorPage from './pages/dashboard/ContentAutomatorPage';
import ProjectDetailsPage from './pages/dashboard/ProjectDetailsPage';
import AssistantPage from './pages/AssistantPage';
import AdManagerPage from './pages/dashboard/AdManagerPage';
import FinancialsPage from './pages/dashboard/FinancialsPage';

// Client Portal Pages
import ClientDashboardPage from './pages/client/ClientDashboardPage';
import ClientProjectsPage from './pages/client/ClientProjectsPage';
import ClientInvoicesPage from './pages/client/ClientInvoicesPage';
import ClientSupportPage from './pages/client/ClientSupportPage';
import ClientProfilePage from './pages/client/ClientProfilePage';
import ClientRequestsPage from './pages/client/ClientRequestsPage';
import AiPublisherPage from './pages/client/AiPublisherPage';
import ClientAdsPage from './pages/client/ClientAdsPage';
import ClientProjectDetailsPage from './pages/client/ClientProjectDetailsPage';


// Helper function to update a meta tag
const updateMetaTag = (property: 'name' | 'property', value: string, content: string) => {
    let element = document.head.querySelector(`meta[${property}='${value}']`) as HTMLMetaElement;
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(property, value);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
};

// Helper function to update JSON-LD structured data
const updateStructuredData = (data: object | null) => {
    let element = document.head.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (data) {
        if (!element) {
            element = document.createElement('script');
            element.type = 'application/ld+json';
            document.head.appendChild(element);
        }
        element.textContent = JSON.stringify(data);
    } else if (element) {
        element.remove();
    }
};


const App: React.FC = () => {
  const { route, navigate } = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    const updateTitleAndMeta = async () => {
        const baseTitle = "إعلانات القاهرة | Cairoeg";
        let pageTitle = baseTitle;
        let pageDescription = "إعلانات القاهرة (Cairoeg) هي شريكك الرقمي للنجاح. نقدم خدمات الإعلانات الممولة، تحسين محركات البحث (SEO)، التصميم الجرافيكي، وتطوير المواقع والمتاجر الإلكترونية في مصر.";
        let pageKeywords = "تسويق رقمي, إعلانات ممولة, SEO, تصميم جرافيك, تطوير مواقع, حملات إعلانية, فيسبوك, جوجل, انستغرام, مصر, القاهرة, Cairoeg";
        let ogImage = "https://i.postimg.cc/1RN16091/image.png";

        const path = route;
        const [_, baseRoute, slug, ...rest] = path.split('/');
        
        updateStructuredData({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "إعلانات القاهرة | Cairoeg",
            "url": "https://cairoeg.online/",
            "logo": "https://i.postimg.cc/1RN16091/image.png",
            "contactPoint": { "@type": "ContactPoint", "telephone": "+20-102-267-9250", "contactType": "Customer Service" },
            "sameAs": ["https://wa.me/201022679250", "https://www.facebook.com/cairoeg.online", "https://www.instagram.com/cairo_eg.online/"]
        });
        
        switch (baseRoute) {
            case 'services':
                switch (slug) {
                    case 'marketing': pageTitle = `التسويق الرقمي - ${baseTitle}`; pageDescription = "خدمات تسويق رقمي وإعلانات ممولة احترافية لزيادة مبيعاتك ونمو علامتك التجارية على الإنترنت."; break;
                    case 'graphic-design': pageTitle = `التصميم الجرافيكي - ${baseTitle}`; pageDescription = "تصميم هويات بصرية وشعارات إبداعية تعكس قصة علامتك التجارية وتجذب انتباه جمهورك."; break;
                    case 'web-design': pageTitle = `تصميم المواقع - ${baseTitle}`; pageDescription = "نطور مواقع ومتاجر إلكترونية سريعة، آمنة، ومتجاوبة تضمن أفضل تجربة لعملائك."; break;
                    case 'ad-creation': pageTitle = `إنشاء الإعلانات - ${baseTitle}`; pageDescription = "نتولى جميع خطوات حملتك الإعلانية من الفكرة إلى الإطلاق والمتابعة لضمان تحقيق أهدافك."; break;
                    default: pageTitle = `الخدمات - ${baseTitle}`;
                }
                break;
            case 'pricing': pageTitle = `باقات وأسعار التسويق الرقمي - ${baseTitle}`; pageDescription = "اكتشف باقات أسعارنا المرنة التي تناسب جميع أحجام الشركات، من الناشئة إلى الكبيرة."; break;
            case 'portfolio':
                if (slug) {
                    const client = await findUserByPhone(slug);
                    if(client) {
                        pageTitle = `أعمالنا مع ${client.name} - ${baseTitle}`;
                        pageDescription = `شاهد معرض أعمالنا ومشاريعنا الناجحة التي قمنا بتنفيذها مع ${client.name}.`;
                    }
                } else { pageTitle = `معرض أعمالنا في التسويق الرقمي - ${baseTitle}`; pageDescription = "شاهد قصص نجاح عملائنا وتعرف على جودة المشاريع التي نفخر بتقديمها في مختلف المجالات."; }
                break;
            case 'ads': 
                 if (slug) {
                    const ad = await getAdById(slug);
                     if (ad) {
                        pageTitle = `${ad.title} | إعلانات المنصة`;
                        pageDescription = ad.description;
                        ogImage = ad.image_url;
                    }
                } else {
                    pageTitle = `إعلانات المنصة - ${baseTitle}`;
                    pageDescription = "تصفح الإعلانات والخدمات المقدمة من عملاء وشركاء منصة إعلانات القاهرة.";
                }
                break;
            case 'about': pageTitle = `عن وكالة إعلانات القاهرة للتسويق - ${baseTitle}`; pageDescription = "تعرف على رؤيتنا، رسالتنا، وفريق الخبراء الذي يعمل بشغف ليكون شريك نجاحك الرقمي."; break;
            case 'contact': pageTitle = `تواصل معنا لاستشارة تسويقية مجانية - ${baseTitle}`; pageDescription = "لديك سؤال أو مشروع جديد؟ فريقنا جاهز لمساعدتك. تواصل معنا الآن لبدء قصة نجاحك."; break;
            case 'login': pageTitle = `تسجيل الدخول - ${baseTitle}`; break;
            case 'register': pageTitle = `إنشاء حساب جديد - ${baseTitle}`; break;
            case 'forgot-password': pageTitle = `استعادة كلمة المرور - ${baseTitle}`; break;
            case 'payments': pageTitle = `طرق الدفع - ${baseTitle}`; break;
            case 'terms': pageTitle = `شروط الخدمة - ${baseTitle}`; break;
            case 'privacy': pageTitle = `سياسة الخصوصية - ${baseTitle}`; break;
            case 'publish-article': pageTitle = `انشر مقالتك - ${baseTitle}`; break;
            case 'guide': pageTitle = `دليل المنصة - ${baseTitle}`; break;
            case 'blog': 
                if (slug) {
                    const post = await getPostBySlug(slug);
                    if (post && post.authorId) {
                        const author = await findUserById(post.authorId);
                        pageTitle = `${post.title} - بقلم ${author?.name || 'فريقنا'} | ${baseTitle}`;
                        pageDescription = post.excerpt;
                        pageKeywords = [...new Set([...post.tags, post.category, ...post.title.split(' ').filter(w => w.length > 3)])].join(', ');
                        ogImage = post.imageUrl;
                        updateStructuredData({ "@context": "https://schema.org", "@type": "Article", "mainEntityOfPage": { "@type": "WebPage", "@id": `${window.location.origin}/blog/${post.slug}` }, "headline": post.title, "description": post.excerpt, "image": post.imageUrl, "author": { "@type": "Person", "name": author?.name || 'فريق إعلانات القاهرة' }, "publisher": { "@type": "Organization", "name": "إعلانات القاهرة | Cairoeg", "logo": { "@type": "ImageObject", "url": "https://i.postimg.cc/1RN16091/image.png" } }, "datePublished": new Date(post.date).toISOString() });
                    } else { pageTitle = `المقال غير موجود - ${baseTitle}`; }
                } else { pageTitle = `المدونة - ${baseTitle}`; pageDescription = "مقالات ورؤى حول أحدث استراتيجيات التسويق الرقمي لمساعدتك على النمو في السوق المصري والعربي."; }
                break;
            case 'author': 
                if (slug) { const author = await findUserByPhone(slug); pageTitle = `مقالات الكاتب ${author?.name || ''} - ${baseTitle}`; }
                break;
            case 'dashboard': pageTitle = `لوحة التحكم - ${baseTitle}`; break;
            case 'client': pageTitle = `بوابة العميل - ${baseTitle}`; break;
        }

        document.title = pageTitle;
        updateMetaTag('name', 'description', pageDescription);
        updateMetaTag('name', 'keywords', pageKeywords);
        updateMetaTag('property', 'og:title', pageTitle);
        updateMetaTag('property', 'og:description', pageDescription);
        updateMetaTag('property', 'og:url', window.location.href);
        updateMetaTag('property', 'og:image', ogImage);
        updateMetaTag('property', 'twitter:title', pageTitle);
        updateMetaTag('property', 'twitter:description', pageDescription);
        updateMetaTag('property', 'twitter:image', ogImage);
    };

    updateTitleAndMeta();
  }, [route]);
  
  
  const renderPublicPage = () => {
    const [_, mainRoute, slug] = route.split('/');
    switch (mainRoute) {
        case '': return <HomePage />;
        case 'services':
            switch (slug) {
                case 'marketing': return <MarketingPage />;
                case 'graphic-design': return <GraphicDesignPage />;
                case 'web-design': return <WebDesignPage />;
                case 'ad-creation': return <AdCreationPage />;
                default: return <ServicesPage />; 
            }
        case 'pricing': return <PricingPage />;
        case 'portfolio': return slug ? <PortfolioClientPage clientPhone={slug} /> : <PortfolioPage />;
        case 'ads': return <AdsShowcasePage />;
        case 'about': return <AboutPage />;
        case 'contact': return <ContactPage />;
        case 'login': return <LoginPage />;
        case 'register': return <RegisterPage />;
        case 'forgot-password': return <ForgotPasswordPage />;
        case 'payments': return <PaymentsPage />;
        case 'terms': return <TermsPage />;
        case 'privacy': return <PrivacyPolicyPage />;
        case 'publish-article': return <PublishArticlePage />;
        case 'guide': return <PlatformGuidePage />;
        case 'author': return slug ? <AuthorProfilePage authorPhone={slug} /> : <BlogPage />;
        case 'blog': return slug ? <BlogPostPage slug={slug} /> : <BlogPage />;
        default: return <HomePage />;
    }
  };
  
  const renderDashboardPage = () => {
      const [_, __, page, param] = route.split('/');
      switch (page) {
          case 'overview': return <DashboardOverviewPage />;
          case 'clients': return param ? <ClientDetailsPage clientPhone={param} /> : <ClientsPage />;
          case 'project': return param ? <ProjectDetailsPage projectId={param} /> : <DashboardOverviewPage />;
          case 'requests': return <RequestsManagerPage />;
          case 'articles': return <ArticleManagerPage />;
          case 'comments': return <CommentManagerPage />;
          case 'aistudio': return <AIStudioPage />;
          case 'assistant': return <AssistantPage />;
          case 'content-automator': return <ContentAutomatorPage />;
          case 'ads': return <AdManagerPage />;
          case 'financials': return <FinancialsPage />;
          default: return <DashboardOverviewPage />;
      }
  };

  const renderClientPortalPage = () => {
      const [_, __, page, param] = route.split('/');
      switch(page) {
          case 'dashboard': return <ClientDashboardPage />;
          case 'profile': return <ClientProfilePage />;
          case 'projects': return <ClientProjectsPage />;
          case 'project': return param ? <ClientProjectDetailsPage projectId={param} /> : <ClientProjectsPage />;
          case 'invoices': return <ClientInvoicesPage />;
          case 'requests': return <ClientRequestsPage />;
          case 'ai-publisher': return <AiPublisherPage />;
          case 'support': return <ClientSupportPage />;
          case 'ads': return <ClientAdsPage />;
          default: return <ClientDashboardPage />;
      }
  }
  
  const renderContent = () => {
    if (loading) {
      return <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">جاري التحميل...</div>;
    }

    const isAuthRoute = route.startsWith('/login') || route.startsWith('/register') || route.startsWith('/forgot-password');
    const isDashboardRoute = route.startsWith('/dashboard');
    const isClientPortalRoute = route.startsWith('/client');

    if (currentUser && isAuthRoute) {
        navigate(currentUser.role === 'admin' ? '/dashboard/overview' : '/client/dashboard');
        return null;
    }

    if (isDashboardRoute) {
      if (!currentUser) { navigate('/login'); return null; }
      if (currentUser.role !== 'admin') { navigate('/client/dashboard'); return null; }
      return (
        <DashboardLayout>
          {renderDashboardPage()}
        </DashboardLayout>
      );
    }

    if (isClientPortalRoute) {
      if (!currentUser) { navigate('/login'); return null; }
       if (currentUser.role !== 'client') { navigate('/dashboard/overview'); return null; }
      return (
        <ClientLayout>
            {renderClientPortalPage()}
        </ClientLayout>
      );
    }

    return (
      <div className="flex flex-col min-h-screen font-sans bg-dark-bg text-slate-300">
        <TopNav />
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
    <>
        {renderContent()}
    </>
  );
};

export default App;