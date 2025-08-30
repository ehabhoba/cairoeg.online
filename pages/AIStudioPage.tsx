import React, { useState } from 'react';
import { ai } from '../services/geminiService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useNotification } from '../hooks/useNotification';
import { CopyIcon } from '../components/icons/CopyIcon';

type Tab = 'articles' | 'social' | 'ads';

const AIStudioPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('articles');
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState('');
    const [inputs, setInputs] = useState({
        articles: '',
        social: '',
        ads: ''
    });
    const addNotification = useNotification();

    const handleInputChange = (tab: Tab, value: string) => {
        setInputs(prev => ({ ...prev, [tab]: value }));
    };

    const handleGenerate = async () => {
        if (!inputs[activeTab].trim() || !ai) {
            addNotification("خطأ", !ai ? "خدمة الذكاء الاصطناعي غير مهيأة" : "الرجاء إدخال وصف.", "error");
            return;
        }

        setIsLoading(true);
        setOutput('');
        let prompt = '';

        switch(activeTab) {
            case 'articles':
                prompt = `بناءً على الموضوع التالي، قم بتوليد 5 أفكار جذابة لعناوين مقالات مدونة باللغة العربية. يجب أن تكون العناوين مثيرة للاهتمام ومناسبة للتسويق الرقمي. الموضوع: "${inputs.articles}"`;
                break;
            case 'social':
                prompt = `بناءً على الموضوع التالي، قم بإنشاء 3 منشورات قصيرة ومؤثرة لوسائل التواصل الاجتماعي (فيسبوك وتويتر) باللغة العربية. يجب أن تتضمن المنشورات هاشتاجات ذات صلة. الموضوع: "${inputs.social}"`;
                break;
            case 'ads':
                prompt = `بناءً على وصف المنتج/الخدمة التالي، قم بكتابة نسختين إعلانيتين متكاملتين (headline and body) لمنصة فيسبوك باللغة العربية. يجب أن تكون النصوص مقنعة وتحث على اتخاذ إجراء. الوصف: "${inputs.ads}"`;
                break;
        }

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            setOutput(response.text);
        } catch (error) {
            console.error("AI Generation Error:", error);
            addNotification("خطأ", "فشل في توليد المحتوى. يرجى المحاولة مرة أخرى.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        addNotification("تم النسخ", "تم نسخ المحتوى المولد بنجاح.", "success", 3000);
    };

    const renderContent = () => {
        const placeholders: Record<Tab, string> = {
            articles: 'مثال: أهمية التسويق بالمحتوى للشركات الناشئة',
            social: 'مثال: إطلاق مجموعة أزياء صيفية جديدة',
            ads: 'مثال: نقدم دورات تدريبية متخصصة في التسويق الرقمي عبر الإنترنت'
        };

        const titles: Record<Tab, string> = {
            articles: 'توليد أفكار مقالات',
            social: 'إنشاء منشورات سوشيال ميديا',
            ads: 'كتابة نصوص إعلانية'
        };

        return (
            <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-4">{titles[activeTab]}</h2>
                <textarea
                    value={inputs[activeTab]}
                    onChange={(e) => handleInputChange(activeTab, e.target.value)}
                    placeholder={placeholders[activeTab]}
                    className="w-full h-28 p-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary resize-none"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !inputs[activeTab].trim()}
                    className="mt-4 w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary transition-all disabled:opacity-50"
                >
                    {isLoading ? <LoadingSpinner /> : 'توليد المحتوى'}
                </button>
            </div>
        );
    };

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">استوديو الذكاء الاصطناعي</h1>
                <p className="text-slate-400 mb-6">استخدم قوة Gemini لمساعدتك في إنشاء محتوى إبداعي وفعال.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <div className="flex border-b border-slate-700 mb-4">
                            {(['articles', 'social', 'ads'] as Tab[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-2 px-4 text-sm font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-primary text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {tab === 'articles' ? 'مقالات' : tab === 'social' ? 'سوشيال ميديا' : 'إعلانات'}
                                </button>
                            ))}
                        </div>
                        {renderContent()}
                    </div>

                    <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg min-h-[400px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">النتائج</h2>
                            <button onClick={handleCopy} disabled={!output} className="p-2 text-slate-400 hover:text-white disabled:opacity-50"><CopyIcon className="w-5 h-5"/></button>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4 h-full min-h-[300px] text-slate-300 whitespace-pre-wrap overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <LoadingSpinner />
                                </div>
                            ) : output || 'سيظهر المحتوى المولد هنا...'}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AIStudioPage;
