import React, { useState, useEffect } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getOrders, deleteOrder } from "../services/orderService";
import OrderTable from "../components/OrderTable";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import DeleteModal from "../components/DeleteModal";

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    
    // Filters and Search
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const statusOptions = [
        { label: "Placed", value: "PLACED" },
        { label: "Processing", value: "PROCESSING" },
        { label: "Ready to Ship", value: "READY_TO_SHIP" },
        { label: "Shipped", value: "SHIPPED" },
        { label: "Delivered", value: "DELIVERED" }
    ];

    const fetchOrders = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        
        setError(null);
        try {
            const data = await getOrders(statusFilter);
            setOrders(data.data || []);
        } catch (err) {
            setError(err.message || "Failed to fetch orders.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]); // Refetch when status filter changes

    const handleDeleteClick = (id) => {
        setOrderToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;
        
        setIsDeleting(true);
        try {
            await deleteOrder(orderToDelete);
            // Optimistically update UI
            setOrders(orders.filter(o => o._id !== orderToDelete));
            setDeleteModalOpen(false);
            setOrderToDelete(null);
        } catch (err) {
            alert(err.message || "Failed to delete order");
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter orders locally by search query
    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            order._id.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query)
        );
    });

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title" style={{ marginBottom: '8px' }}>Order Dashboard</h1>
                    <p className="text-muted">Manage and track all customer orders</p>
                </div>
                <Link to="/create" className="btn btn-primary">
                    <Plus size={16} /> New Order
                </Link>
            </div>

            <div className="controls-bar glass-panel animate-fade-in">
                <div className="controls-left">
                    <SearchBar 
                        value={searchQuery} 
                        onChange={setSearchQuery} 
                        placeholder="Search by ID or Name..." 
                    />
                    <FilterDropdown 
                        value={statusFilter} 
                        onChange={setStatusFilter} 
                        options={statusOptions} 
                    />
                </div>
                <button 
                    className="btn btn-outline refresh-btn" 
                    onClick={() => fetchOrders(true)}
                    disabled={refreshing || loading}
                >
                    <RefreshCw size={16} className={refreshing ? "spin" : ""} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="error-banner animate-fade-in">
                    <p>{error}</p>
                    <button className="btn btn-outline" onClick={() => fetchOrders()}>Try Again</button>
                </div>
            )}

            {!error && (
                <div className="table-wrapper animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    {loading && !refreshing ? (
                        <Loader message="Loading orders..." />
                    ) : filteredOrders.length === 0 ? (
                        <EmptyState 
                            title="No orders found" 
                            description={searchQuery || statusFilter ? "Try adjusting your filters to find what you're looking for." : "You don't have any orders yet. Create one to get started."} 
                        />
                    ) : (
                        <OrderTable orders={filteredOrders} onDeleteClick={handleDeleteClick} />
                    )}
                </div>
            )}

            <DeleteModal 
                isOpen={deleteModalOpen}
                onClose={() => !isDeleting && setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                orderId={orderToDelete}
                isDeleting={isDeleting}
            />

            <style>{`
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                }
                .text-muted {
                    color: var(--text-muted);
                }
                .controls-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    margin-bottom: var(--spacing-lg);
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .controls-left {
                    display: flex;
                    gap: 16px;
                    flex: 1;
                    flex-wrap: wrap;
                }
                .error-banner {
                    background-color: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #f87171;
                    padding: 16px;
                    border-radius: var(--radius-md);
                    margin-bottom: var(--spacing-lg);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
