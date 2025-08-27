import React from 'react';
import { WhatsappIcon } from './icons/WhatsappIcon';

const FloatingWhatsAppButton: React.FC = () => {
    const whatsappUrl = "https://wa.me/201022679250?text=" + encodeURIComponent("مرحباً إعلانات القاهرة، أود الاستفسار عن خدماتكم.");

    return (
        <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-30 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg text-white transform hover:scale-110 transition-transform"
            aria-label="Contact us on WhatsApp"
        >
            <WhatsappIcon className="w-8 h-8" />
        </a>
    );
};

export default FloatingWhatsAppButton;
