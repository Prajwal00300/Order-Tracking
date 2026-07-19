import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderForm from "../components/OrderForm";
import { createOrder } from "../services/orderService";

const CreateOrder = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            await createOrder(formData);
            navigate("/");
        } catch (err) {
            setError(err.message || "Failed to create order");
            window.scrollTo(0, 0);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="error-banner animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto 20px auto' }}>
                    <p>{error}</p>
                </div>
            )}
            
            <OrderForm 
                title="Create New Order"
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
            
            <style>{`
                .error-banner {
                    background-color: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #f87171;
                    padding: 16px;
                    border-radius: var(--radius-md);
                }
            `}</style>
        </div>
    );
};

export default CreateOrder;
