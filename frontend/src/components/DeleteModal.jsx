import React from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, orderId, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in glass-panel">
                <button className="close-btn" onClick={onClose} disabled={isDeleting}>
                    <X size={20} />
                </button>
                
                <div className="modal-header">
                    <div className="warning-icon">
                        <AlertTriangle size={24} />
                    </div>
                    <h3>Delete Order</h3>
                </div>
                
                <p className="modal-body">
                    Are you sure you want to delete order <strong>{orderId?.substring(0, 8)}...</strong>? 
                    This action cannot be undone.
                </p>
                
                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete Order"}
                    </button>
                </div>
            </div>
            
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    position: relative;
                    width: 100%;
                    max-width: 400px;
                    padding: 24px;
                    background: var(--bg-card);
                }
                .close-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .close-btn:hover {
                    color: var(--text-main);
                }
                .modal-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                .warning-icon {
                    color: var(--accent-danger);
                    background: rgba(239, 68, 68, 0.1);
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                }
                .modal-header h3 {
                    font-size: 1.25rem;
                }
                .modal-body {
                    color: var(--text-muted);
                    margin-bottom: 24px;
                    line-height: 1.5;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }
            `}</style>
        </div>
    );
};

export default DeleteModal;
