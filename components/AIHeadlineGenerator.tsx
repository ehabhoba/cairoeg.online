
import React, { useState } from 'react';
import { ai } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

const AIHeadlineGenerator: React.FC = () => {
    const [productDesc, setProductDesc] = useState('');
    const [headlines, setHeadlines] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateHeadlines = async () => {
        if (!productDesc.trim() || !ai) {
            setError(!ai ? "AI service is not configured." : "Please enter a product description.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setHeadlines([]);

        const prompt = `Based on the following product description, generate 5 catchy and effective advertising headlines suitable for social media. The headlines should be in Arabic. Product description: "${productDesc}"`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const text = response.text;
            // Simple parsing assuming headlines are numbered or on new lines
            const parsedHeadlines = text.split('\n').map(h => h.replace(/^[0-9-.\s*]+/, '').trim()).filter(Boolean);
            setHeadlines(parsedHeadlines);
        } catch (e) {
            console.error(e);
            setError('Failed to generate headlines. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">أدخل وصف منتجك هنا</h3>
                    <textarea
                        value={productDesc}
                        onChange={(e) => setProductDesc(e.target.value)}
                        placeholder="مثال: حقائب جلدية مصنوعة يدوياً للنساء، تتميز بالجودة العالية والتصميم الأنيق..."
                        className="w-full h-32 p-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary resize-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={generateHeadlines}
                        disabled={isLoading || !productDesc.trim()}
                        className="mt-4 w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-dark-bg bg-gold hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-gold transition-all disabled:opacity-50"
                    >
                        {isLoading ? <LoadingSpinner /> : 'توليد العناوين'}
                    </button>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">عناوين مقترحة:</h3>
                    {headlines.length > 0 ? (
                        <ul className="space-y-3">
                            {headlines.map((headline, index) => (
                                <li key={index} className="bg-slate-900 p-3 rounded-lg text-slate-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                    {headline}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg p-8">
                           {isLoading ? 'جاري التفكير...' : 'ستظهر العناوين المقترحة هنا.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIHeadlineGenerator;
