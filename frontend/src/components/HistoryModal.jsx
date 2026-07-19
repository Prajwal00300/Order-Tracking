import React, { useState, useEffect } from "react";
import { X, Clock, ArrowRight } from "lucide-react";
import { getOrderHistory } from "../services/orderService";
import Loader from "./Loader";
import StatusBadge from "./StatusBadge";

const HistoryModal = ({ isOpen, onClose, orderId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !orderId) return;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOrderHistory(orderId);
                setHistory(data.data || []);
            } catch (err) {
                setError(err.message || "Failed to fetch history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [isOpen, orderId]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in glass-panel">
                <div className="modal-header">
                    <h2>Order Status History</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <p className="text-muted" style={{ marginBottom: '20px' }}>
                        Tracking history for Order ID: <span className="font-mono">{orderId.substring(orderId.length - 6).toUpperCase()}</span>
                    </p>

                    {loading ? (
                        <Loader message="Fetching timeline..." />
                    ) : error ? (
                        <div className="error-banner">
                            <p>{error}</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="empty-state">
                            <Clock size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>No status changes recorded yet.</p>
                        </div>
                    ) : (
                        <div className="timeline">
                            {history.map((event, index) => (
                                <div key={event._id} className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    {index !== history.length - 1 && <div className="timeline-line"></div>}
                                    <div className="timeline-content">
                                        <div className="timeline-date">
                                            {new Date(event.changedAt).toLocaleString()}
                                        </div>
                                        <div className="timeline-status-change">
                                            <StatusBadge status={event.previousStatus} />
                                            <ArrowRight size={16} className="text-muted" />
                                            <StatusBadge status={event.newStatus} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-color);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-color);
                    background: rgba(255, 255, 255, 0.02);
                }
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: var(--radius-sm);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-main);
                }
                .modal-body {
                    padding: 24px;
                    overflow-y: auto;
                }
                .text-muted { color: var(--text-muted); }
                .font-mono { font-family: ui-monospace, SFMono-Regular, monospace; }
                
                /* Timeline Styles */
                .timeline {
                    display: flex;
                    flex-direction: column;
                    padding-left: 8px;
                }
                .timeline-item {
                    position: relative;
                    padding-left: 24px;
                    padding-bottom: 24px;
                }
                .timeline-item:last-child {
                    padding-bottom: 0;
                }
                .timeline-marker {
                    position: absolute;
                    left: -4px;
                    top: 4px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    border: 2px solid #1e1e24; /* Match typical background */
                    z-index: 2;
                }
                .timeline-line {
                    position: absolute;
                    left: 1px;
                    top: 16px;
                    bottom: -4px;
                    width: 2px;
                    background: rgba(255, 255, 255, 0.1);
                    z-index: 1;
                }
                .timeline-date {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                }
                .timeline-status-change {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 12px;
                    border-radius: var(--radius-md);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 0;
                    text-align: center;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default HistoryModal;
