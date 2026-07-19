import React from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";

const OrderTable = ({ orders, onDeleteClick }) => {
    return (
        <div className="table-container glass-panel">
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th className="actions-col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id} className="table-row">
                            <td className="font-mono text-muted">
                                {order._id.substring(order._id.length - 6).toUpperCase()}
                            </td>
                            <td>
                                <div className="customer-info">
                                    <span className="font-medium">{order.customerName}</span>
                                    <span className="text-sm text-muted">{order.phone}</span>
                                </div>
                            </td>
                            <td>{order.productName}</td>
                            <td className="font-medium">${order.amount.toFixed(2)}</td>
                            <td><StatusBadge status={order.orderStatus} /></td>
                            <td><StatusBadge status={order.paymentStatus} /></td>
                            <td>
                                <div className="date-info">
                                    <Clock size={14} className="text-muted" />
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </td>
                            <td className="actions-col">
                                <div className="action-buttons">
                                    <Link to={`/edit/${order._id}`} className="action-btn edit-btn" title="Edit Order">
                                        <Edit2 size={16} />
                                    </Link>
                                    <button 
                                        className="action-btn delete-btn" 
                                        onClick={() => onDeleteClick(order._id)}
                                        title="Delete Order"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
                .table-container {
                    overflow-x: auto;
                    border-radius: var(--radius-md);
                }
                .order-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .order-table th {
                    background-color: rgba(0, 0, 0, 0.2);
                    padding: 16px;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid var(--border-color);
                }
                .order-table td {
                    padding: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    vertical-align: middle;
                }
                .table-row {
                    transition: background-color 0.2s;
                }
                .table-row:hover {
                    background-color: rgba(255, 255, 255, 0.02);
                }
                .font-mono {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                }
                .font-medium {
                    font-weight: 500;
                }
                .text-muted {
                    color: var(--text-muted);
                }
                .text-sm {
                    font-size: 0.875rem;
                }
                .customer-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .date-info {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.875rem;
                }
                .actions-col {
                    text-align: right;
                }
                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }
                .action-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-sm);
                    border: none;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .edit-btn:hover {
                    background: rgba(59, 130, 246, 0.2);
                    color: #60a5fa;
                }
                .delete-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                    color: #f87171;
                }
            `}</style>
        </div>
    );
};

export default OrderTable;
