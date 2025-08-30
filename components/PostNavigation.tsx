
import React from 'react';
import { BlogPost } from '../data/blogData';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface PostNavigationProps {
    previousPost?: BlogPost;
    nextPost?: BlogPost;
}

const NavCard: React.FC<{ post: BlogPost; type: 'previous' | 'next' }> = ({ post, type }) => (
    <a href={`/blog/${post.slug}`} className="group block w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:border-primary hover:bg-slate-800">
        <div className={`flex items-center gap-4 ${type === 'next' ? 'justify-end text-left' : 'justify-start text-right'}`}>
            {type === 'previous' && <ArrowRightIcon className="w-8 h-8 text-slate-500 group-hover:text-primary transition-colors flex-shrink-0" />}
            <div>
                <p className="text-sm font-semibold text-primary">{type === 'previous' ? 'المقال السابق' : 'المقال التالي'}</p>
                <h4 className="font-bold text-white mt-1 group-hover:text-primary-light transition-colors">{post.title}</h4>
            </div>
            {type === 'next' && <ArrowLeftIcon className="w-8 h-8 text-slate-500 group-hover:text-primary transition-colors flex-shrink-0" />}
        </div>
    </a>
);

const PostNavigation: React.FC<PostNavigationProps> = ({ previousPost, nextPost }) => {
    return (
        <div className="mt-16 pt-12 border-t border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    {previousPost ? (
                        <NavCard post={previousPost} type="previous" />
                    ) : (
                        <div className="h-full w-full p-6 rounded-2xl border border-dashed border-slate-700/50 flex items-center justify-center text-slate-500">
                            لا يوجد مقال سابق
                        </div>
                    )}
                </div>
                <div>
                    {nextPost ? (
                        <NavCard post={nextPost} type="next" />
                    ) : (
                         <div className="h-full w-full p-6 rounded-2xl border border-dashed border-slate-700/50 flex items-center justify-center text-slate-500">
                            لا يوجد مقال تالٍ
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostNavigation;
