
import React, { useState } from 'react';
import { ai } from '../../services/geminiService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../hooks/useNotification';
import { publishPost } from '../../data/blogData';

const ContentAutomatorPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedArticle, setGeneratedArticle] = useState<{ title: string; content: string } | null>(null);
    const addNotification = useNotification();

    const handleGenerate = async () => {
        if (!topic.trim() || !ai) {
            addNotification("خطأ", !ai ? "خدمة الذكاء الاصطناعي غير مهيأة" : "الرجاء إدخال موضوع للمقال.", "error");
            return;
        }

        setIsLoading(true);
        setGeneratedArticle(null);
        
        const prompt = `أنت كاتب محتوى متخصص في التسويق الرقمي. اكتب مقالًا احترافيًا باللغة العربية حول الموضوع التالي: "${topic}".
يجب أن يتضمن المقال:
1.  عنوان جذاب.
2.  مقدمة شيقة.
3.  عدة فقرات تستخدم عناوين فرعية (باستخدام ###).
4.  خاتمة تلخص النقاط الرئيسية.

الرجاء تنسيق الإجابة بحيث يكون السطر الأول هو العنوان فقط، ثم اترك سطرًا فارغًا، ثم ابدأ محتوى المقال.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });

            const text = response.text;
            const lines = text.split('\n');
            const title = lines[0];
            const content = lines.slice(2).join('\n'); // Skip the empty line after title
            
            setGeneratedArticle({ title, content });
            addNotification("نجاح", "تم إنشاء المقال بنجاح. يمكنك مراجعته ونشره.", "success");

        } catch (error) {
            console.error("AI Generation Error:", error);
            addNotification("خطأ", "فشل في توليد المقال. يرجى المحاولة مرة أخرى.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePublish = async () => {
        if (!generatedArticle) return;
        
        setIsLoading(true);
        try {
            await publishPost({
                title: generatedArticle.title,
                content: generatedArticle.content,
                authorPhone: '01022679250', // Admin phone
                category: 'تحسين محركات البحث', // Default category
                tags: topic.split(' '),
                imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(topic.split(' ')[0])}`, // Random image based on topic
                excerpt: generatedArticle.content.substring(0, 150) + '...'
            });
            addNotification("تم النشر!", "تم نشر المقال في المدونة بنجاح.", "success");
            setGeneratedArticle(null);
            setTopic('');
        } catch (error) {
             addNotification("خطأ", "فشل نشر المقال.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">أتمتة المحتوى للمنصة</h1>
                <p className="text-slate-400 mb-6">أنشئ مقالات عالية الجودة تلقائيًا لتحسين محركات البحث (SEO) وإثراء محتوى المدونة.</p>

                <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                     <h2 className="text-xl font-bold text-white mb-4">1. أدخل موضوع المقال</h2>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="مثال: أهمية تحسين سرعة الموقع لترتيب جوجل"
                        className="w-full h-24 p-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary resize-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !topic.trim()}
                        className="mt-4 w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary transition-all disabled:opacity-50"
                    >
                        {isLoading && !generatedArticle ? <LoadingSpinner /> : 'إنشاء المقال'}
                    </button>
                </div>
                
                {generatedArticle && (
                     <div className="mt-8 bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg animate-fade-in">
                         <h2 className="text-xl font-bold text-white mb-4">2. مراجعة ونشر</h2>
                         <div className="bg-slate-900 rounded-lg p-4 h-full max-h-96 text-slate-300 whitespace-pre-wrap overflow-y-auto border border-slate-700">
                             <h3 className="text-2xl font-bold text-white mb-4">{generatedArticle.title}</h3>
                             <p>{generatedArticle.content}</p>
                         </div>
                         <button
                            onClick={handlePublish}
                            disabled={isLoading}
                            className="mt-4 w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-dark-bg bg-gold hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-gold transition-all disabled:opacity-50"
                         >
                            {isLoading ? <LoadingSpinner /> : 'نشر في المدونة الآن'}
                         </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ContentAutomatorPage;
