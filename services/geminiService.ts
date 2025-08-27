import { GoogleGenAI } from "@google/genai";

// NOTE: The API key is sourced from `process.env.API_KEY` which is configured in the build environment.
const apiKey = process.env.API_KEY;

// Export a configured client instance, or null if the key is missing.
// The UI component will handle the null case gracefully.
export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const SYSTEM_INSTRUCTION = `أنت 'مساعد القاهرة الإعلاني'، مساعد ذكاء اصطناعي متخصص في منصة 'Cairoeg'. دورك هو مساعدة مديري الحملات والعملاء في تحليل أداء الإعلانات، اقتراح استراتيجيات تسويقية، إنشاء تقارير الأداء، وتقديم رؤى حول السوق المصري. يجب أن تكون ردودك احترافية، دقيقة، ومبنية على البيانات. استخدم اللهجة المصرية الرسمية في جميع تواصلاتك.`;