import React, { useState, useEffect } from "react";
import { Clock, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { getSchedulerLogs } from "../services/orderService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const SchedulerLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);

    const fetchLogs = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        
        setError(null);
        try {
            const data = await getSchedulerLogs(page, 15);
            setLogs(data.data || []);
            setTotalPages(data.totalPages || 1);
            setTotalLogs(data.total || 0);
        } catch (err) {
            setError(err.message || "Failed to fetch logs.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    return (
        <div className="logs-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title" style={{ marginBottom: '8px' }}>Scheduler Logs</h1>
                    <p className="text-muted">History of automated order status updates</p>
                </div>
                <button 
                    className="btn btn-outline" 
                    onClick={() => fetchLogs(true)}
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
                    <button className="btn btn-outline" onClick={() => fetchLogs()}>Try Again</button>
                </div>
            )}

            {!error && (
                <div className="table-wrapper animate-fade-in glass-panel">
                    {loading && !refreshing ? (
                        <Loader message="Loading logs..." />
                    ) : logs.length === 0 ? (
                        <EmptyState 
                            title="No logs found" 
                            description="The scheduler has not executed yet." 
                        />
                    ) : (
                        <>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>Run ID</th>
                                            <th>Started At</th>
                                            <th>Completed At</th>
                                            <th>Duration</th>
                                            <th>Orders Processed</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => {
                                            const start = new Date(log.startedAt);
                                            const end = log.completedAt ? new Date(log.completedAt) : null;
                                            const durationMs = end ? end.getTime() - start.getTime() : null;
                                            
                                            return (
                                                <tr key={log._id} className="table-row">
                                                    <td className="font-mono text-muted">
                                                        {log._id.substring(log._id.length - 6).toUpperCase()}
                                                    </td>
                                                    <td>
                                                        <div className="date-info">
                                                            <Clock size={14} className="text-muted" />
                                                            <span>{start.toLocaleString()}</span>
                                                        </div>
                                                    </td>
                                                    <td>{end ? end.toLocaleTimeString() : '-'}</td>
                                                    <td className="font-mono">
                                                        {durationMs !== null ? `${durationMs}ms` : '-'}
                                                    </td>
                                                    <td className="font-medium text-center">
                                                        {log.ordersProcessed}
                                                    </td>
                                                    <td>
                                                        {log.status === 'SUCCESS' ? (
                                                            <span className="badge badge-delivered" style={{ display: 'inline-flex', gap: '4px' }}>
                                                                <CheckCircle size={14} /> SUCCESS
                                                            </span>
                                                        ) : (
                                                            <span className="badge badge-pending" title={log.error} style={{ display: 'inline-flex', gap: '4px' }}>
                                                                <AlertTriangle size={14} /> FAILED
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <span className="text-muted">Showing {logs.length} of {totalLogs} logs</span>
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

            <style>{`
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                }
                .text-muted { color: var(--text-muted); }
                .text-center { text-align: center; }
                .font-mono { font-family: ui-monospace, SFMono-Regular, monospace; }
                .font-medium { font-weight: 500; }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
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
                .table-row:hover {
                    background-color: rgba(255, 255, 255, 0.02);
                }
                .date-info {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.875rem;
                }
                
                /* Badges (reusing some from StatusBadge logic) */
                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
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

                .pagination {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.2);
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
            `}</style>
        </div>
    );
};

export default SchedulerLogs;
