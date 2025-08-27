
import React from 'react';

const ClientSupportPage: React.FC = () => {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    
    const whatsappMessage = `مرحباً فريق الدعم،\n\nأحتاج مساعدة بخصوص:\n${subject}\n\nالتفاصيل:\n${message}\n\n(رسالة من بوابة العميل)`;
    const whatsappUrl = `https://wa.me/201022679250?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    event.currentTarget.reset();
  };

  return (
    <main className="flex-1 bg-slate-50 p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-800">الدعم الفني</h1>
            <p className="text-slate-500 mt-1">نحن هنا لمساعدتك. كيف يمكننا خدمتك اليوم؟</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">فتح تذكرة دعم جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700">الموضوع</label>
                <input type="text" name="subject" id="subject" required className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="مثال: استفسار عن فاتورة، مشكلة فنية..." />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">اشرح طلبك بالتفصيل</label>
                <textarea name="message" id="message" rows={5} required className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                  إرسال عبر واتساب
                </button>
                 <p className="text-xs text-slate-500 mt-2 text-center">سيتم فتح محادثة واتساب جديدة مع فريق الدعم لدينا.</p>
              </div>
            </form>
        </div>
      </div>
    </main>
  );
};

export default ClientSupportPage;
