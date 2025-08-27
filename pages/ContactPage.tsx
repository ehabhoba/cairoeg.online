import React from 'react';
import { EnvelopeIcon } from '../components/icons/EnvelopeIcon';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { MapPinIcon } from '../components/icons/MapPinIcon';

const ContactPage: React.FC = () => {
    
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;
    
    const whatsappMessage = `مرحباً إعلانات القاهرة،\n\nالاسم: ${name}\nالخدمة المطلوبة: ${service}\n\nالرسالة:\n${message}`;
    const whatsappUrl = `https://wa.me/201022679250?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    event.currentTarget.reset();
  };
    
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            تواصل معنا
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
            لديك سؤال أو مشروع جديد؟ فريقنا جاهز لمساعدتك.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">أرسل لنا رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">الاسم الكامل</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-300">الخدمة المطلوبة</label>
                <select name="service" id="service" required className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary">
                    <option>استشارة عامة</option>
                    <option>إعلانات ممولة</option>
                    <option>تصميم جرافيكي</option>
                    <option>تصميم مواقع ومتاجر</option>
                    <option>تحسين محركات البحث (SEO)</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300">رسالتك</label>
                <textarea name="message" id="message" rows={4} required className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary transition-all hover:scale-105">
                  إرسال عبر واتساب
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">معلومات الاتصال</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/20 text-primary rounded-lg"><EnvelopeIcon /></div>
                  <div>
                    <h3 className="font-semibold text-white">البريد الإلكتروني</h3>
                    <a href="mailto:cairoeg.ads@gmail.com" className="text-slate-400 hover:text-primary">cairoeg.ads@gmail.com</a>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/20 text-primary rounded-lg"><PhoneIcon /></div>
                  <div>
                    <h3 className="font-semibold text-white">واتساب وهاتف</h3>
                    <a href="https://wa.me/201022679250" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-primary">01022679250</a>
                    <span className="block text-slate-400">01140057253</span>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/20 text-primary rounded-lg"><MapPinIcon /></div>
                  <div>
                    <h3 className="font-semibold text-white">الموقع</h3>
                    <p className="text-slate-400">القاهرة, مصر</p>
                  </div>
                </div>
              </div>
            </div>
             <div className="rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden h-64">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221164.7958996113!2d31.11718049615525!3d30.05948381273824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b217c81%3A0x94d693ba683de029!2sCairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1678886565355!5m2!1sen!2seg" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'invert(90%)' }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Our Location"
                ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;