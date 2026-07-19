import React from "react";
import { PackageOpen } from "lucide-react";

const EmptyState = ({ title = "No data found", description = "Try adjusting your filters or search query." }) => {
    return (
        <div className="empty-state animate-fade-in glass-panel">
            <div className="icon-wrapper">
                <PackageOpen size={48} strokeWidth={1.5} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            
            <style>{`
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                    margin-top: 20px;
                }
                .icon-wrapper {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 50%;
                    margin-bottom: 20px;
                    color: var(--text-muted);
                }
                .empty-state h3 {
                    font-size: 1.25rem;
                    color: var(--text-main);
                    margin-bottom: 8px;
                }
                .empty-state p {
                    color: var(--text-muted);
                    max-width: 300px;
                }
            `}</style>
        </div>
    );
};

export default EmptyState;
