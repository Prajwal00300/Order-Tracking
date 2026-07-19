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
    
    // Filters, Search, Pagination
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    
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
            const data = await getOrders(statusFilter, debouncedSearch, page);
            setOrders(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalOrders(data.total || 0);
        } catch (err) {
            setError(err.message || "Failed to fetch orders.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Refetch when dependencies change
    useEffect(() => {
        fetchOrders();
    }, [statusFilter, debouncedSearch, page]);

    // Reset page when status changes
    const handleStatusChange = (status) => {
        setStatusFilter(status);
        setPage(1);
    };

    const handleDeleteClick = (id) => {
        setOrderToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;
        
        setIsDeleting(true);
        try {
            await deleteOrder(orderToDelete);
            // Re-fetch to ensure pagination stays correct
            fetchOrders(true);
            setDeleteModalOpen(false);
            setOrderToDelete(null);
        } catch (err) {
            alert(err.message || "Failed to delete order");
        } finally {
            setIsDeleting(false);
        }
    };

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
                        onChange={handleStatusChange} 
                        options={statusOptions} 
                    />
                </div>
                <button 
                    className="btn btn-outline refresh-btn" 
                    onClick={() => fetchOrders(true)}
                    disabled={refreshing || loading}
                    style={{ minWidth: '120px' }}
                >
                    <RefreshCw size={16} className={refreshing ? "spin" : ""} />
                    {refreshing ? "Refreshing..." : "Refresh"}
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
                    ) : orders.length === 0 ? (
                        <EmptyState 
                            title="No orders found" 
                            description={debouncedSearch || statusFilter ? "Try adjusting your filters to find what you're looking for." : "You don't have any orders yet. Create one to get started."} 
                        />
                    ) : (
                        <>
                            <OrderTable orders={orders} onDeleteClick={handleDeleteClick} />
                            
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <span className="text-muted">Showing {orders.length} of {totalOrders} orders</span>
                                    <div className="pagination-controls">
                                        <button 
                                            className="btn btn-outline" 
                                            disabled={page === 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                        >
                                            Previous
                                        </button>
                                        <span className="page-indicator">Page {page} of {totalPages}</span>
                                        <button 
                                            className="btn btn-outline" 
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
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
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .pagination {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.2);
                    border-bottom-left-radius: var(--radius-md);
                    border-bottom-right-radius: var(--radius-md);
                    border-top: 1px solid var(--border-color);
                }
                .pagination-controls {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .page-indicator {
                    font-size: 0.875rem;
                    color: var(--text-main);
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
