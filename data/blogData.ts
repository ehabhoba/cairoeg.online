
import { findUserByPhone } from './userData';

export const blogCategories = ['الكل', 'الإعلانات الممولة', 'تحسين محركات البحث', 'تصميم جرافيكي', 'تصميم مواقع'];

export interface BlogPost {
    slug: string;
    title: string;
    authorPhone: string;
    date: string;
    category: string;
    tags: string[];
    imageUrl: string;
    excerpt: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Comment {
    id: number;
    postSlug: string;
    authorPhone: string;
    authorName: string;
    content: string;
    date: string;
    status: 'pending' | 'approved';
}

const BLOG_DB_KEY = 'cairoeg-blog-posts';
const COMMENTS_DB_KEY = 'cairoeg-blog-comments';

const initialPosts: BlogPost[] = [
    {
        slug: '5-mistakes-in-facebook-ads',
        title: '5 أخطاء شائعة تدمر ميزانية إعلاناتك على فيسبوك وكيف تتجنبها',
        authorPhone: '01022679250',
        date: '15 يوليو 2024',
        category: 'الإعلانات الممولة',
        tags: ['فيسبوك', 'إعلانات', 'تسويق رقمي', 'ميزانية', 'استهداف الجمهور'],
        imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop&q=80',
        excerpt: 'هل تنفق الكثير على إعلانات فيسبوك دون الحصول على النتائج المرجوة؟ قد تكون ترتكب أحد هذه الأخطاء القاتلة. اكتشف كيف تتجنبها لتحقيق أفضل عائد على استثمارك.',
        content: `تعتبر إعلانات فيسبوك أداة قوية للغاية للوصول إلى جمهورك المستهدف، ولكن من السهل جدًا إهدار الميزانية إذا لم يتم إعداد الحملات بشكل صحيح. في هذا المقال، سنستعرض 5 أخطاء شائعة يقع فيها الكثيرون.

### الخطأ الأول: عدم تحديد الهدف بوضوح
قبل إطلاق أي حملة، يجب أن تسأل نفسك: *ماذا أريد أن أحقق؟* هل هو زيادة الوعي بالعلامة التجارية، أم جذب زيارات للموقع، أم تحقيق مبيعات مباشرة؟ كل هدف يتطلب إعدادات مختلفة.

> "الفشل في التخطيط هو تخطيط للفشل." - مقولة شهيرة تنطبق تمامًا على الحملات الإعلانية.

### الخطأ الثاني: استهداف جمهور واسع جدًا
أحد أكبر مزايا فيسبوك هو القدرة على الاستهداف الدقيق. تجنب استهداف جمهور عام. بدلاً من ذلك، استخدم الخصائص الديموغرافية والاهتمامات والسلوكيات لتحديد جمهورك المثالي.

### الأخطاء الشائعة الأخرى
لتحقيق أفضل النتائج، تجنب أيضًا الأخطاء التالية:
*   **تجاهل اختبار A/B:** قم دائمًا باختبار عناصر مختلفة في إعلانك (مثل الصور، النصوص، ودعوات اتخاذ الإجراء) لمعرفة ما يناسب جمهورك بشكل أفضل.
*   **تصميم إعلان ضعيف:** الصورة أو الفيديو هما أول ما يجذب الانتباه. استثمر في تصميمات عالية الجودة تعكس علامتك التجارية.
*   **عدم متابعة الأداء:** لا تطلق الحملة وتتركها. راقب أداءها باستمرار وقم بإجراء التحسينات اللازمة.

لمعرفة المزيد حول خدماتنا الإعلانية، يمكنك زيارة [صفحة إنشاء الإعلانات](/services/ad-creation).`,
        status: 'approved'
    },
    {
        slug: 'importance-of-seo',
        title: 'لماذا يعتبر SEO استثمارًا طويل الأمد لا يمكن لعملك تجاهله؟',
        authorPhone: '01022679250',
        date: '05 يوليو 2024',
        category: 'تحسين محركات البحث',
        tags: ['SEO', 'تسويق المحتوى', 'بحث جوجل', 'نمو مستدام'],
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&q=80',
        excerpt: 'في عالم الإعلانات المدفوعة، يظل تحسين محركات البحث (SEO) هو الأصل الرقمي الأكثر قيمة الذي يمكنك بناؤه. تعرف على الأسباب التي تجعل الـ SEO استثمارًا لا غنى عنه لنمو عملك المستدام.',
        content: `في عالم يعتمد بشكل كبير على البحث عبر الإنترنت، يظل تحسين محركات البحث (SEO) هو الأصل الرقمي الأكثر قيمة الذي يمكنك بناؤه. إنه ليس مجرد "كلمات مفتاحية"، بل هو استراتيجية متكاملة تضمن ظهورك أمام العملاء الباحثين عنك تحديدًا.

### لماذا الـ SEO استثمار وليس تكلفة؟
على عكس الإعلانات التي تتوقف نتائجها بمجرد توقف الدفع، فإن جهود الـ SEO تبني قيمة مستمرة. كل مقال تكتبه أو رابط خلفي تكتسبه يضيف إلى قوة موقعك على المدى الطويل.

### ركائز الـ SEO الناجح
تعتمد استراتيجية الـ SEO القوية على عدة ركائز أساسية، أهمها:
*   **الـ SEO التقني (Technical SEO):** التأكد من أن موقعك سريع، آمن، وسهل الأرشفة من قبل محركات البحث.
*   **المحتوى هو الملك (Content is King):** إنشاء محتوى عالي الجودة يجيب على أسئلة جمهورك ويقدم لهم قيمة حقيقية.
*   **بناء الروابط (Link Building):** الحصول على روابط من مواقع أخرى موثوقة، مما يزيد من مصداقية موقعك لدى جوجل.

الاستثمار في الـ SEO اليوم يعني ضمان تدفق مستمر من الزيارات المؤهلة والمجانية غدًا. يمكنك الاطلاع على [خدماتنا في التسويق و SEO](/services/marketing) لمعرفة كيف يمكننا مساعدتك. **لا تتأخر في بناء أصولك الرقمية!**`,
        status: 'approved'
    }
];

// --- Database Simulation ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Post Management ---
export const initializeBlog = (): void => {
    if (!localStorage.getItem(BLOG_DB_KEY)) {
        localStorage.setItem(BLOG_DB_KEY, JSON.stringify(initialPosts));
    }
     if (!localStorage.getItem(COMMENTS_DB_KEY)) {
        localStorage.setItem(COMMENTS_DB_KEY, JSON.stringify([]));
    }
};

const getPosts = async (): Promise<BlogPost[]> => {
    await simulateDelay(200);
    const postsJson = localStorage.getItem(BLOG_DB_KEY);
    return postsJson ? JSON.parse(postsJson) : [];
};

const savePosts = async (posts: BlogPost[]): Promise<void> => {
    await simulateDelay(200);
    localStorage.setItem(BLOG_DB_KEY, JSON.stringify(posts));
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
    return await getPosts();
};

export const getApprovedPosts = async (): Promise<BlogPost[]> => {
    const allPosts = await getPosts();
    return allPosts.filter(p => p.status === 'approved');
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
    const posts = await getPosts();
    return posts.find(p => p.slug === slug);
};

export const getPostsByAuthor = async (authorPhone: string): Promise<BlogPost[]> => {
    const posts = await getPosts();
    return posts.filter(p => p.authorPhone === authorPhone && p.status === 'approved');
};

export const addPost = async (post: Omit<BlogPost, 'slug' | 'date' | 'status'>): Promise<void> => {
    const posts = await getPosts();
    const newPost: BlogPost = {
        ...post,
        slug: post.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
        date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'pending'
    };
    posts.unshift(newPost); // Add to the beginning
    await savePosts(posts);
};

export const updatePostStatus = async (slug: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
    let posts = await getPosts();
    posts = posts.map(p => p.slug === slug ? { ...p, status } : p);
    await savePosts(posts);
};

// --- Comment Management ---

const getComments = async (): Promise<Comment[]> => {
    await simulateDelay(100);
    const commentsJson = localStorage.getItem(COMMENTS_DB_KEY);
    return commentsJson ? JSON.parse(commentsJson) : [];
};

const saveComments = async (comments: Comment[]): Promise<void> => {
    await simulateDelay(100);
    localStorage.setItem(COMMENTS_DB_KEY, JSON.stringify(comments));
};

export const getAllComments = async (): Promise<Comment[]> => {
    return await getComments();
};

export const getApprovedComments = async (postSlug: string): Promise<Comment[]> => {
    const allComments = await getComments();
    const commentsForPost = allComments.filter(c => c.postSlug === postSlug && c.status === 'approved');
    
    // Enrich with author name
    const enrichedComments = await Promise.all(commentsForPost.map(async (comment) => {
        const author = await findUserByPhone(comment.authorPhone);
        return { ...comment, authorName: author?.name || 'مستخدم' };
    }));
    return enrichedComments;
};

export const addComment = async (postSlug: string, authorPhone: string, content: string): Promise<void> => {
    const comments = await getComments();
    const author = await findUserByPhone(authorPhone);
    const newComment: Comment = {
        id: Date.now(),
        postSlug,
        authorPhone,
        authorName: author?.name || 'مستخدم',
        content,
        date: new Date().toISOString(),
        status: 'pending'
    };
    comments.push(newComment);
    await saveComments(comments);
};

export const updateCommentStatus = async (id: number, status: 'approved'): Promise<void> => {
    let comments = await getComments();
    comments = comments.map(c => c.id === id ? { ...c, status } : c);
    await saveComments(comments);
};

export const deleteComment = async (id: number): Promise<void> => {
    let comments = await getComments();
    comments = comments.filter(c => c.id !== id);
    await saveComments(comments);
};
