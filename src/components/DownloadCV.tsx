import { Download } from 'lucide-react';
import React from 'react';

const DownloadCV: React.FC = () => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/David_Casasola_Mora_Resume.pdf';
        link.download = 'David_Casasola_Mora_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors duration-300 group cursor-pointer"
            title='Download my CV'
        >
            <Download className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
        </button>
    );
};

export default DownloadCV;
