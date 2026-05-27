import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch, HiChevronDown, HiX, HiEye } from "react-icons/hi";
import api from "../../services/api";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-gray-100 text-gray-600 dark:bg-dark-600 dark:text-gray-400",
};

function OrderDetailModal({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.orderStatus);
  const [tracking, setTracking] = useState(order.trackingNumber || "");
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/orders/admin/${order._id}/status`, { status, trackingNumber: tracking });
      toast.success("Order status updated!");
      onUpdate();
      onClose();
    } catch { toast.error("Failed to update"); }
    finally { setUpdating(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white dark:bg-dark-700 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-dark-700 px-6 py-4 border-b border-gray-100 dark:border-dark-600 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">Order #{order._id.slice(-8).toUpperCase()}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600">
            <HiX className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer */}
          <div className="p-4 bg-gray-50 dark:bg-dark-600 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Customer</p>
            <p className="font-semibold text-gray-900 dark:text-white">{order.user?.name}</p>
            <p className="text-sm text-gray-400">{order.user?.email}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Items</p>
            <div className="space-y-2">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-dark-600 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order total */}
          <div className="p-4 bg-gray-50 dark:bg-dark-600 rounded-xl flex justify-between items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Total</span>
            <span className="font-black text-gray-900 dark:text-white text-lg">₹{order.totalPrice?.toLocaleString()}</span>
          </div>

          {/* Update status */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Update Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Tracking Number</label>
              <input value={tracking} onChange={(e) => setTracking(e.target.value)}
                placeholder="e.g. 1Z999AA10123456784" className="input" />
            </div>
            <button onClick={handleUpdate} disabled={updating} className="btn-primary w-full py-3">
              {updating ? "Updating..." : "Update Order"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders/admin/all", { params: { page, limit: 15, status: filter || undefined } });
      setOrders(data.orders);
      setTotal(data.total);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, filter]);

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-400">{total} total orders</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="input py-2 pl-3 pr-8 text-sm min-w-[150px]">
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-700 rounded-2xl border border-gray-100 dark:border-dark-600 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-600 bg-gray-50 dark:bg-dark-600/50">
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-600">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No orders found</td></tr>
              ) : (
                orders.map((order) => (
                  <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono font-bold text-gray-700 dark:text-gray-300">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[140px]">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.orderItems?.length}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.isPaid ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors">
                        <HiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 15 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-dark-600 flex items-center justify-between">
            <p className="text-xs text-gray-400">Page {page} of {Math.ceil(total / 15)}</p>
            <div className="flex gap-1.5">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-dark-600 disabled:opacity-40 hover:bg-gray-200 transition-colors">Prev</button>
              <button disabled={page * 15 >= total} onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-dark-600 disabled:opacity-40 hover:bg-gray-200 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={fetchOrders} />
        )}
      </AnimatePresence>
    </div>
  );
}
