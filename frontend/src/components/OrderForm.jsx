import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

const OrderForm = ({ initialData, onSubmit, isSubmitting, title }) => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        productName: "",
        amount: "",
        paymentStatus: "PENDING",
        orderStatus: "PLACED"
    });

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                customerName: initialData.customerName || "",
                phone: initialData.phone || "",
                productName: initialData.productName || "",
                amount: initialData.amount || "",
                paymentStatus: initialData.paymentStatus || "PENDING",
                orderStatus: initialData.orderStatus || "PLACED"
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="form-wrapper">
            <div className="form-header">
                <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </button>
                <h1 className="page-title" style={{ marginBottom: 0 }}>{title}</h1>
            </div>

            <div className="glass-panel form-container animate-fade-in">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                name="customerName"
                                className="input-field"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                className="input-field"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                className="input-field"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input
                                type="number"
                                name="amount"
                                className="input-field"
                                value={formData.amount}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Payment Status</label>
                            <select
                                name="paymentStatus"
                                className="select-field"
                                value={formData.paymentStatus}
                                onChange={handleChange}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="PAID">PAID</option>
                            </select>
                        </div>

                        {/* Only show order status if we are editing an existing order */}
                        {initialData && (
                            <div className="form-group">
                                <label>Order Status</label>
                                <select
                                    name="orderStatus"
                                    className="select-field"
                                    value={formData.orderStatus}
                                    onChange={handleChange}
                                >
                                    <option value="PLACED">PLACED</option>
                                    <option value="PROCESSING">PROCESSING</option>
                                    <option value="READY_TO_SHIP">READY_TO_SHIP</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? (
                                "Saving..."
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Order
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .form-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: var(--spacing-lg);
                }
                .form-container {
                    padding: 32px;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-muted);
                }
                .form-actions {
                    margin-top: 32px;
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .submit-btn {
                    padding: 10px 24px;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
};

export default OrderForm;
