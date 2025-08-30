import React, { useState } from 'react';
import { ai } from '../../services/geminiService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import { publishPost } from '../../data/blogData';

const AiPublisherPage: React.FC = () => {
    const { currentUser } = useAuth();
    const addNotification = useNotification();
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedArticle, setGeneratedArticle] = useState<{ title: string; content: string } | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim() || !ai) {
            addNotification("خطأ", !ai ? "خدمة الذكاء الاصطناعي غير مهيأة" : "الرجاء إدخال موضوع المقال.", "error");
            return;
        }

        setIsLoading(true);
        setGeneratedArticle(null);
        
        const prompt = `بصفتك خبيرًا في كتابة المحتوى، قم بإنشاء مقال باللغة العربية حول الموضوع التالي: "${topic}". يجب أن يكون المقال مناسبًا لمدونة أعمال ويحتوي على عنوان جذاب، مقدمة، عدة فقرات بعناوين فرعية (باستخدام ###)، وخاتمة. يجب أن يكون السطر الأول من إجابتك هو عنوان المقال فقط. في نهاية المقال، أضف ملاحظة قصيرة مثل: "تم إنشاء هذا المقال بواسطة ناشر إعلانات القاهرة الذكي. تواصل معنا على https://cairoeg.online/ لمعرفة المزيد."`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });

            const text = response.text;
            const lines = text.split('\n');
            const title = lines[0];
            const content = lines.slice(2).join('\n');
            
            setGeneratedArticle({ title, content });
            addNotification("نجاح", "تم إنشاء المقال. يمكنك مراجعته ونشره.", "success");

        } catch (error) {
            console.error("AI Generation Error:", error);
            addNotification("خطأ", "فشل في توليد المقال.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePublish = async () => {
        if (!generatedArticle || !currentUser) return;
        
        setIsLoading(true);
        try {
            await publishPost({
                title: generatedArticle.title,
                content: generatedArticle.content,
                authorPhone: currentUser.phone,
                category: 'مقالات العملاء', 
                tags: topic.split(' '),
                imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(topic.split(' ')[0])}`,
                excerpt: generatedArticle.content.substring(0, 150) + '...'
            });
            addNotification("تم النشر!", "تم نشر مقالك في المدونة بنجاح.", "success");
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
                <h1 className="text-3xl font-bold text-white mb-2">ناشر المقالات الذكي</h1>
                <p className="text-slate-400 mb-6">أنشئ وانشر مقالاتك الخاصة في مدونتنا لتعزيز علامتك التجارية والتسويق بالمحتوى.</p>

                <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">1. أدخل موضوع مقالك</h2>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="مثال: كيف ساعد التسويق الرقمي في نمو شركتي"
                        className="w-full h-24 p-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary resize-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !topic.trim()}
                        className="mt-4 w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isLoading && !generatedArticle ? <LoadingSpinner /> : 'إنشاء المقال'}
                    </button>
                </div>
                
                {generatedArticle && (
                     <div className="mt-8 bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg animate-fade-in">
                         <h2 className="text-xl font-bold text-white mb-4">2. مراجعة ونشر</h2>
                         <div className="bg-slate-900 rounded-lg p-4 max-h-96 text-slate-300 whitespace-pre-wrap overflow-y-auto border border-slate-700">
                             <h3 className="text-2xl font-bold text-white mb-4">{generatedArticle.title}</h3>
                             <p>{generatedArticle.content}</p>
                         </div>
                         <button
                            onClick={handlePublish}
                            disabled={isLoading}
                            className="mt-4 w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-dark-bg bg-gold hover:bg-gold/90 disabled:opacity-50"
                         >
                            {isLoading ? <LoadingSpinner /> : 'نشر المقال الآن'}
                         </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AiPublisherPage;