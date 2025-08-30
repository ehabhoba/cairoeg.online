import React, { useState, useEffect } from 'react';

const ReadingProgressBar: React.FC = () => {
    const [width, setWidth] = useState(0);

    const scrollListener = () => {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        setWidth(progress);
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollListener);
        return () => window.removeEventListener('scroll', scrollListener);
    }, []);

    return (
        <div 
            className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
            style={{ width: `${width}%` }}
        />
    );
};

export default ReadingProgressBar;