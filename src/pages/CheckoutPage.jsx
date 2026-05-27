import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiCheck, HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineClipboardCheck } from "react-icons/hi";
import api from "../services/api";
import toast from "react-hot-toast";
import { clearCartAsync } from "../redux/slices/cartSlice";
import { selectCartTotal } from "../redux/slices/cartSlice";
import { PageWrapper } from "../components/ui/index";

const STEPS = [
  { id: 1, label: "Address", icon: HiOutlineLocationMarker },
  { id: 2, label: "Payment", icon: HiOutlineCreditCard },
  { id: 3, label: "Review", icon: HiOutlineClipboardCheck },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const cartTotal = useSelector(selectCartTotal);
  const { user } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const activeItems = items.filter((i) => !i.savedForLater);
  const shipping = cartTotal > 499 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax - couponDiscount;

  const handleAddressChange = (k) => (e) => setAddress((a) => ({ ...a, [k]: e.target.value }));

  const validateAddress = () => {
    const required = ["fullName", "phone", "street", "city", "state", "pincode"];
    return required.every((k) => address[k].trim());
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await api.post("/orders/coupon/validate", { code: couponCode, cartTotal });
      setCouponDiscount(data.discount);
      toast.success(`Coupon applied! You save ₹${data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: activeItems.map((i) => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.images?.[0]?.url,
          price: i.product.price,
          quantity: i.quantity,
          variant: i.variant,
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cartTotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        couponCode,
        discount: couponDiscount,
      };

      const { data } = await api.post("/orders", orderData);
      dispatch(clearCartAsync());
      toast.success("Order placed successfully! 🎉");
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (activeItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <PageWrapper className="min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2.5 cursor-pointer ${step >= s.id ? "text-primary-600" : "text-gray-400"}`}
                onClick={() => step > s.id && setStep(s.id)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${step > s.id ? "bg-green-500 text-white" : step === s.id ? "bg-primary-600 text-white shadow-glow-sm" : "bg-gray-100 dark:bg-dark-700 text-gray-400"}`}>
                  {step > s.id ? <HiCheck className="w-5 h-5" /> : s.id}
                </div>
                <span className="hidden sm:block text-sm font-semibold">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-colors ${step > s.id ? "bg-green-500" : "bg-gray-200 dark:bg-dark-600"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Address */}
              {step === 1 && (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="card p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Address</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Full Name*</label>
                      <input value={address.fullName} onChange={handleAddressChange("fullName")} className="input" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Phone*</label>
                      <input value={address.phone} onChange={handleAddressChange("phone")} className="input" placeholder="+91 98765 43210" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Street Address*</label>
                      <input value={address.street} onChange={handleAddressChange("street")} className="input" placeholder="House/Flat No, Street, Area" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">City*</label>
                      <input value={address.city} onChange={handleAddressChange("city")} className="input" placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">State*</label>
                      <input value={address.state} onChange={handleAddressChange("state")} className="input" placeholder="Maharashtra" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Pincode*</label>
                      <input value={address.pincode} onChange={handleAddressChange("pincode")} className="input" placeholder="400001" maxLength={6} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Country</label>
                      <input value={address.country} readOnly className="input bg-gray-50 dark:bg-dark-600 cursor-not-allowed" />
                    </div>
                  </div>
                  <button
                    onClick={() => { if (!validateAddress()) { toast.error("Please fill all required fields"); return; } setStep(2); }}
                    className="btn-primary w-full py-3.5 mt-2">
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="card p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                  {[
                    { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", emoji: "💵" },
                    { value: "razorpay", label: "Razorpay", desc: "UPI, Cards, Net Banking", emoji: "💳" },
                    { value: "stripe", label: "Stripe", desc: "Credit/Debit Card", emoji: "🔐" },
                  ].map((m) => (
                    <label key={m.value} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                      ${paymentMethod === m.value ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20" : "border-gray-200 dark:border-dark-500 hover:border-gray-300"}`}>
                      <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value}
                        onChange={(e) => setPaymentMethod(e.target.value)} className="accent-primary-600" />
                      <span className="text-2xl">{m.emoji}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.label}</p>
                        <p className="text-xs text-gray-400">{m.desc}</p>
                      </div>
                    </label>
                  ))}

                  {/* Coupon */}
                  <div className="pt-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Have a coupon?</label>
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code" className="input flex-1 uppercase font-mono" />
                      <button onClick={applyCoupon} className="btn-secondary px-5 whitespace-nowrap">Apply</button>
                    </div>
                    {couponDiscount > 0 && (
                      <p className="text-sm text-green-600 font-semibold mt-2">✅ Coupon applied! You save ₹{couponDiscount}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3.5">Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3.5">Review Order</button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="card p-6 space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Your Order</h2>
                  {/* Items */}
                  <div className="space-y-3">
                    {activeItems.map((item) => (
                      <div key={item._id} className="flex gap-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                        <img src={item.product?.images?.[0]?.url} alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{item.product?.name}</p>
                          {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Address summary */}
                  <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-xl text-sm">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Delivery to:</p>
                    <p className="text-gray-500">{address.fullName}, {address.phone}</p>
                    <p className="text-gray-500">{address.street}, {address.city}, {address.state} {address.pincode}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-3.5">Back</button>
                    <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1 py-3.5 text-base">
                      {loading ? (
                        <span className="flex items-center gap-2 justify-center">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Placing Order...
                        </span>
                      ) : "Place Order 🎉"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal ({activeItems.length} items)</span><span>₹{cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax (5%)</span><span>₹{tax}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-₹{couponDiscount}</span></div>}
                <div className="border-t border-gray-100 dark:border-dark-600 pt-2.5 flex justify-between font-bold text-base text-gray-900 dark:text-white">
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="mt-3 text-xs text-center text-orange-500">Add ₹{(499 - cartTotal).toLocaleString()} more for free shipping!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
