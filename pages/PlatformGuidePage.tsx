import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-3">
        <CheckCircleIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <span className="text-slate-300">{children}</span>
    </li>
);

const PlatformGuidePage: React.FC = () => {
    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="خريطة المنصة ودليل الاستخدام"
                    subtitle="مرحبًا بك في دليل إعلانات القاهرة. هنا، ستجد شرحًا مبسطًا لكيفية عمل نظامنا المتكامل لمساعدتك على تحقيق أهدافك."
                />
                
                <div className="space-y-12">
                    {/* Section 1: For Clients */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                        <h2 className="text-3xl font-bold text-white mb-4">بوابة العميل: مركز التحكم الخاص بك</h2>
                        <p className="text-slate-400 mb-6">
                            بوابتك الخاصة هي المكان الذي يمكنك من خلاله متابعة كل شيء يتعلق بأعمالك معنا. بعد تسجيل الدخول، ستتمكن من الوصول إلى:
                        </p>
                        <ul className="space-y-4">
                            <FeatureListItem>
                                <strong>لوحة التحكم:</strong> نظرة سريعة على مشاريعك النشطة، فواتيرك المستحقة، وآخر الملفات التي تم رفعها.
                            </FeatureListItem>
                            <FeatureListItem>
                                <strong>إدارة المشاريع والفواتير:</strong> تتبع حالة مشاريعك الحالية والسابقة واطلع على جميع فواتيرك بسهولة.
                            </FeatureListItem>
                             <FeatureListItem>
                                <strong>الطلبات والدعم:</strong> قدم طلبات جديدة للخدمات (حملات، تصميمات) وتواصل مع فريق الدعم الفني مباشرة.
                            </FeatureListItem>
                            <FeatureListItem>
                                <strong>الناشر الذكي (AI Publisher):</strong> استخدم قوة الذكاء الاصطناعي لكتابة ونشر مقالاتك الخاصة في مدونتنا لتعزيز علامتك التجارية.
                            </FeatureListItem>
                        </ul>
                    </div>
                    
                    {/* Section 2: For Admins */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                        <h2 className="text-3xl font-bold text-white mb-4">لوحة تحكم المدير: إدارة شاملة</h2>
                        <p className="text-slate-400 mb-6">
                            تم تصميم لوحة تحكم المدير لتوفير سيطرة كاملة على جميع جوانب المنصة، مما يتيح لك إدارة الأعمال بكفاءة:
                        </p>
                         <ul className="space-y-4">
                            <FeatureListItem>
                                <strong>نظرة عامة تحليلية:</strong> احصل على بيانات حية حول الإيرادات، عدد العملاء، وأداء المنصة العام.
                            </FeatureListItem>
                            <FeatureListItem>
                                <strong>إدارة العملاء والمشاريع:</strong> يمكنك عرض تفاصيل كل عميل، وإضافة وإدارة مشاريعهم وفواتيرهم، ورفع الملفات، وتعيين المهام.
                            </FeatureListItem>
                             <FeatureListItem>
                                <strong>إدارة المحتوى:</strong> مراجعة والموافقة على المقالات والتعليقات المقدمة من المستخدمين لضمان جودة المحتوى.
                            </FeatureListItem>
                            <FeatureListItem>
                                <strong>أدوات الذكاء الاصطناعي:</strong> استخدم "استوديو AI" و"أتمتة المحتوى" لإنشاء محتوى إعلاني وتسويقي عالي الجودة بسرعة.
                            </FeatureListItem>
                        </ul>
                    </div>

                     {/* Section 3: Dynamic Portfolio */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                        <h2 className="text-3xl font-bold text-white mb-4">معرض الأعمال الديناميكي: عرض تلقائي للنجاح</h2>
                        <p className="text-slate-400 mb-6">
                            نظامنا يعرض أعمالك تلقائيًا. عندما تكمل مشروعًا لعميل، أو تنشر مقالًا باسمه، يقوم النظام بأرشفة هذا العمل وعرضه في معرض أعمالنا:
                        </p>
                         <ul className="space-y-4">
                            <FeatureListItem>
                                <strong>تحديثات تلقائية:</strong> يتم تحديث صفحة "أعمالنا" تلقائيًا لعرض أحدث العملاء الذين لديهم أعمال منجزة.
                            </FeatureListItem>
                            <FeatureListItem>
                                <strong>صفحة خاصة لكل عميل:</strong> كل عميل مميز في معرض الأعمال له صفحته الخاصة التي تعرض تصميماته، مقالاته، وروابط أعماله، مما يوفر دليلاً قويًا على خبرتك.
                            </FeatureListItem>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformGuidePage;
