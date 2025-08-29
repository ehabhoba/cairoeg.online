import React from 'react';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';

interface ShareButtonsProps {
    url: string;
    title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const socialLinks = [
        { 
            name: 'WhatsApp', 
            href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, 
            icon: <WhatsappIcon className="w-5 h-5" />,
            bgColor: 'bg-green-500 hover:bg-green-600'
        },
        { 
            name: 'Facebook', 
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, 
            icon: <FacebookIcon className="w-5 h-5" />,
            bgColor: 'bg-blue-600 hover:bg-blue-700'
        },
        { 
            name: 'Twitter', 
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, 
            icon: <TwitterIcon className="w-5 h-5" />,
            bgColor: 'bg-sky-500 hover:bg-sky-600'
        },
    ];

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-400 ml-2">مشاركة:</span>
            {socialLinks.map(link => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-white transition-colors ${link.bgColor}`}
                    aria-label={`Share on ${link.name}`}
                >
                    {link.icon}
                </a>
            ))}
        </div>
    );
};

export default ShareButtons;