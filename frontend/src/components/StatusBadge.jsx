import React from "react";

const StatusBadge = ({ status }) => {
    
    const getStatusStyles = (statusText) => {
        switch (statusText) {
            case "PLACED":
                return "badge-placed";
            case "PROCESSING":
                return "badge-processing";
            case "READY_TO_SHIP":
                return "badge-ready";
            case "SHIPPED":
                return "badge-shipped";
            case "DELIVERED":
                return "badge-delivered";
            case "PENDING":
                return "badge-pending";
            case "PAID":
                return "badge-paid";
            default:
                return "badge-default";
        }
    };

    return (
        <>
            <span className={`badge ${getStatusStyles(status)}`}>
                {status.replace(/_/g, ' ')}
            </span>

            <style>{`
                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                }
                .badge-placed {
                    background-color: rgba(59, 130, 246, 0.15);
                    color: #60a5fa;
                    border: 1px solid rgba(59, 130, 246, 0.3);
                }
                .badge-processing {
                    background-color: rgba(168, 85, 247, 0.15);
                    color: #c084fc;
                    border: 1px solid rgba(168, 85, 247, 0.3);
                }
                .badge-ready {
                    background-color: rgba(234, 179, 8, 0.15);
                    color: #facc15;
                    border: 1px solid rgba(234, 179, 8, 0.3);
                }
                .badge-shipped {
                    background-color: rgba(249, 115, 22, 0.15);
                    color: #fb923c;
                    border: 1px solid rgba(249, 115, 22, 0.3);
                }
                .badge-delivered {
                    background-color: rgba(16, 185, 129, 0.15);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }
                .badge-pending {
                    background-color: rgba(239, 68, 68, 0.15);
                    color: #f87171;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }
                .badge-paid {
                    background-color: rgba(16, 185, 129, 0.15);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }
                .badge-default {
                    background-color: rgba(148, 163, 184, 0.15);
                    color: #94a3b8;
                    border: 1px solid rgba(148, 163, 184, 0.3);
                }
            `}</style>
        </>
    );
};

export default StatusBadge;
