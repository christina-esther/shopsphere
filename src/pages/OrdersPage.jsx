// ════════════════════════════════════
// OrdersPage.jsx
// ════════════════════════════════════
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineClipboardList, HiChevronRight } from "react-icons/hi";
import api from "../services/api";
import { PageWrapper, EmptyState } from "../components/ui/index";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-gray-100 text-gray-600 dark:bg-dark-600 dark:text-gray-400",
};

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => { setOrders(data.orders); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
    </div>
  );

  return (
    <PageWrapper className="pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <EmptyState icon={HiOutlineClipboardList} title="No orders yet"
            subtitle="When you place orders, they'll show up here"
            action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div key={order._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link to={`/orders/${order._id}`} className="card p-5 block hover:shadow-product transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full capitalize ${STATUS_COLORS[order.orderStatus]}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
                      <p className="text-sm text-gray-500 mt-1">{order.orderItems.length} item(s)</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white">₹{order.totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 capitalize">{order.paymentMethod}</p>
                      </div>
                      <HiChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  {/* Item preview */}
                  <div className="flex gap-2 mt-3">
                    {order.orderItems.slice(0, 4).map((item, j) => (
                      <img key={j} src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl" />
                    ))}
                    {order.orderItems.length > 4 && (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-xs font-bold text-gray-500">
                        +{order.orderItems.length - 4}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default OrdersPage;
