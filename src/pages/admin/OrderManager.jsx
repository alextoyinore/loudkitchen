import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Search,
    RefreshCw,
    Phone,
    Mail,
    User,
    ChevronRight,
    X,
    MoreVertical
} from 'lucide-react';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (!error) setOrders(data || []);
        setLoading(false);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setUpdating(orderId);
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId);

        if (!error) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        }
        setUpdating(null);
    };

    const getStatusStyles = (status) => {
        const map = {
            pending: { bg: 'rgba(234,179,8,0.15)', color: '#facc15', label: 'Pending' },
            processing: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'Processing' },
            ready: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', label: 'Ready' },
            completed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', label: 'Completed' },
            cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Cancelled' },
        };
        return map[status] || map.pending;
    };

    const StatusBadge = ({ status }) => {
        const s = getStatusStyles(status);
        return (
            <span style={{
                background: s.bg, color: s.color,
                padding: '0.25rem 0.65rem', borderRadius: '999px',
                fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase',
                whiteSpace: 'nowrap', border: `1px solid ${s.color}20`
            }}>
                {s.label}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch = !searchTerm ||
            order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_phone?.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    const counts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        ready: orders.filter(o => o.status === 'ready').length,
        completed: orders.filter(o => o.status === 'completed').length,
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        padding: '0.6rem 0.85rem',
        color: '#fff',
        fontSize: '0.875rem',
        outline: 'none',
    };

    return (
        <div style={{ color: '#fff' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>Guest Orders</h1>
                    <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                        {orders.length} total orders · {counts.pending} pending
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', padding: '0.6rem 1rem',
                        color: '#aaa', fontSize: '0.875rem', cursor: 'pointer',
                    }}
                >
                    <RefreshCw size={15} /> Refresh
                </button>
            </div>

            {/* Filters + Search */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {['all', 'pending', 'processing', 'ready', 'completed'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        style={{
                            padding: '0.4rem 0.9rem', borderRadius: '999px', border: 'none',
                            background: filterStatus === s ? 'var(--color-accent, #e8b86d)' : 'rgba(255,255,255,0.07)',
                            color: filterStatus === s ? '#000' : '#aaa',
                            fontWeight: filterStatus === s ? '600' : '400',
                            cursor: 'pointer', fontSize: '0.8rem', textTransform: 'capitalize',
                        }}
                    >
                        {s === 'all' ? 'All' : s} ({counts[s] || filteredOrders.filter(o => o.status === s).length})
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                    <input
                        style={{ ...inputStyle, paddingLeft: '2.25rem', width: '220px' }}
                        placeholder="Search name, phone…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>Loading…</div>
                ) : filteredOrders.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#555' }}>No orders found.</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{
                                            padding: '0.85rem 1.25rem', textAlign: 'left',
                                            color: '#555', fontWeight: '500', whiteSpace: 'nowrap',
                                            fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: selectedOrder?.id === order.id ? 'rgba(232,184,109,0.03)' : 'transparent' }}>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <p style={{ color: '#aaa', fontFamily: 'monospace', fontSize: '0.75rem' }}>#{order.id.substring(0, 8)}</p>
                                            <p style={{ color: '#555', fontSize: '0.7rem' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <p style={{ color: '#fff', fontWeight: '600' }}>{order.customer_name}</p>
                                            <p style={{ color: '#666', fontSize: '0.75rem' }}>{order.customer_phone}</p>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#aaa' }}>
                                            {order.order_items.length} items
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', color: 'var(--color-accent, #e8b86d)', fontWeight: '700' }}>
                                            ₦{parseFloat(order.total_amount).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.06)', border: 'none',
                                                        borderRadius: '6px', padding: '0.4rem 0.6rem',
                                                        color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem'
                                                    }}
                                                >
                                                    <Eye size={14} /> Details
                                                </button>
                                                <div style={{ position: 'relative', display: 'flex' }}>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        disabled={updating === order.id}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.06)', border: 'none',
                                                            borderRadius: '6px', padding: '0.4rem 0.6rem',
                                                            color: '#aaa', cursor: 'pointer', fontSize: '0.75rem', outline: 'none'
                                                        }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="ready">Ready</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '1rem'
                }}>
                    <div style={{
                        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px', width: '100%', maxWidth: '600px',
                        overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Order Details</h2>
                                <p style={{ fontSize: '0.7rem', color: '#555', fontFamily: 'monospace' }}>ID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Customer</h4>
                                    <p style={{ fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>{selectedOrder.customer_name}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <Phone size={14} /> {selectedOrder.customer_phone}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={14} /> {selectedOrder.customer_email}
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Status</h4>
                                    <StatusBadge status={selectedOrder.status} />
                                    <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>Placed: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Items ({selectedOrder.order_items.length})</h4>
                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {selectedOrder.order_items.map((item, idx) => (
                                        <div key={idx} style={{
                                            padding: '1rem',
                                            borderBottom: idx === selectedOrder.order_items.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <div>
                                                <p style={{ fontWeight: '600', color: '#fff' }}>{item.item_name} <span style={{ color: '#555', fontSize: '0.8rem' }}>x{item.quantity}</span></p>
                                                <p style={{ fontSize: '0.75rem', color: '#666' }}>₦{parseFloat(item.unit_price).toLocaleString()} each</p>
                                            </div>
                                            <p style={{ fontWeight: '700', color: '#aaa' }}>₦{parseFloat(item.subtotal).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <div style={{ padding: '1rem', background: 'rgba(232,184,109,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '700', color: '#fff' }}>Total Amount</span>
                                        <span style={{ fontWeight: '800', color: 'var(--color-accent, #e8b86d)', fontSize: '1.2rem' }}>₦{parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <div style={{ padding: '1rem', background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.1)', borderRadius: '12px' }}>
                                    <h4 style={{ fontSize: '0.7rem', color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Special Notes</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#aaa', fontStyle: 'italic' }}>"{selectedOrder.notes}"</p>
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#aaa', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                            <select
                                value={selectedOrder.status}
                                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none',
                                    background: 'var(--color-accent, #e8b86d)', color: '#000',
                                    fontWeight: '700', cursor: 'pointer', outline: 'none'
                                }}
                            >
                                <option value="pending">Mark as Pending</option>
                                <option value="processing">Mark as Processing</option>
                                <option value="ready">Mark as Ready</option>
                                <option value="completed">Mark as Completed</option>
                                <option value="cancelled">Mark as Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
