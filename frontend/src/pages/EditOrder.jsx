import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderForm from "../components/OrderForm";
import Loader from "../components/Loader";
import { getOrderById, updateOrder } from "../services/orderService";

const EditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(id);
                setInitialData(data.data);
            } catch (err) {
                setError("Failed to load order data. " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            await updateOrder(id, formData);
            navigate("/");
        } catch (err) {
            setError(err.message || "Failed to update order");
            window.scrollTo(0, 0);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loader message="Loading order data..." />;
    }

    return (
        <div>
            {error && (
                <div className="error-banner animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto 20px auto' }}>
                    <p>{error}</p>
                </div>
            )}
            
            {initialData && (
                <OrderForm 
                    title="Edit Order"
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}

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

export default EditOrder;
