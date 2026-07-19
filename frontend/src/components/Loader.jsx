import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ message = "Loading..." }) => {
    return (
        <div className="loader-container animate-fade-in">
            <Loader2 className="spinner" size={32} />
            <p className="loader-text">{message}</p>
            
            <style>{`
                .loader-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    color: var(--text-muted);
                }
                .spinner {
                    animation: spin 1s linear infinite;
                    color: var(--accent-primary);
                    margin-bottom: 12px;
                }
                .loader-text {
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;
