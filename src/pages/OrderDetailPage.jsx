import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiCheck, HiOutlineChevronLeft, HiOutlinePrinter } from "react-icons/hi";
import api from "../services/api";
import { PageWrapper } from "../components/ui/index";

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", desc: "Your order has been received" },
  { key: "processing", label: "Processing", desc: "We're preparing your order" },
  { key: "shipped", label: "Shipped", desc: "Your order is on the way" },
  { key: "delivered", label: "Delivered", desc: "Order delivered successfully" },
];

const STATUS_INDEX = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 };

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => { setOrder(data.order); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
      </div>
    );
  }

  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  const currentStep = STATUS_INDEX[order.orderStatus] ?? 0;
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <PageWrapper className="pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/orders" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              <HiOutlineChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Order #{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-sm text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
            </div>
          </div>
          <button onClick={() => window.print()} className="btn-secondary gap-2 hidden sm:flex">
            <HiOutlinePrinter className="w-4 h-4" /> Invoice
          </button>
        </div>

        {/* Order tracking */}
        {!isCancelled && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-6">Order Tracking</h2>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 dark:bg-dark-600" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-primary-500 transition-all duration-700"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`, right: "auto" }}
              />

              <div className="flex justify-between relative">
                {STATUS_STEPS.map((s, i) => (
                  <div key={s.key} className="flex flex-col items-center text-center max-w-[80px]">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                        ${i <= currentStep ? "bg-primary-600 text-white shadow-glow-sm" : "bg-gray-100 dark:bg-dark-700 text-gray-400"}`}
                    >
                      {i < currentStep ? <HiCheck className="w-5 h-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                    </motion.div>
                    <p className={`text-xs font-semibold mt-2 ${i <= currentStep ? "text-primary-600 dark:text-primary-400" : "text-gray-400"}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <span className="font-semibold">Tracking ID: </span>{order.trackingNumber}
                </p>
              </div>
            )}
          </div>
        )}

        {isCancelled && (
          <div className="card p-5 mb-6 border-l-4 border-red-500">
            <p className="font-semibold text-red-600 dark:text-red-400">Order Cancelled</p>
            <p className="text-sm text-gray-400">This order has been cancelled. Refund will be processed in 5–7 business days.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Items ({order.orderItems.length})</h3>
            <div className="space-y-3">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                    {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Price summary */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Items</span><span>₹{order.itemsPrice.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice}`}</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{order.taxPrice.toLocaleString()}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
                <div className="border-t border-gray-100 dark:border-dark-600 pt-2 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                  <span>Total Paid</span><span>₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${order.isPaid ? "bg-green-500" : "bg-orange-400"}`} />
                <span className={`text-xs font-semibold ${order.isPaid ? "text-green-600" : "text-orange-500"}`}>
                  {order.isPaid ? "Payment Confirmed" : "Payment Pending"}
                </span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Delivery Address</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p className="font-semibold text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
