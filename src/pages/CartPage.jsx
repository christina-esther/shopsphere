import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShoppingCart, HiOutlineTrash, HiPlus, HiMinus } from "react-icons/hi";
import { removeFromCart, updateCartItem, selectCartTotal } from "../redux/slices/cartSlice";
import { EmptyState, PageWrapper } from "../components/ui/index";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.cart);
  const cartTotal = useSelector(selectCartTotal);
  const activeItems = items.filter((i) => !i.savedForLater);
  const shipping = cartTotal > 499 ? 0 : 49;

  return (
    <PageWrapper className="pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Shopping Cart ({activeItems.length})</h1>
        {activeItems.length === 0 ? (
          <EmptyState icon={HiOutlineShoppingCart} title="Your cart is empty"
            subtitle="Add items to your cart to checkout"
            action={<Link to="/products" className="btn-primary">Browse Products</Link>} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {activeItems.map((item) => (
                  <motion.div key={item._id} layout exit={{ opacity: 0, height: 0 }}
                    className="card p-4 flex gap-4">
                    <img src={item.product?.images?.[0]?.url} alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product?._id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 line-clamp-2 text-sm">
                        {item.product?.name}
                      </Link>
                      {item.variant && <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>}
                      <p className="text-primary-600 font-bold text-sm mt-1">₹{item.product?.price?.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 dark:border-dark-500 rounded-xl overflow-hidden">
                          <button onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors">
                            <HiMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors">
                            <HiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button onClick={() => dispatch(removeFromCart(item._id))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1.5">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                        <span className="ml-auto font-bold text-gray-900 dark:text-white text-sm">
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="card p-5 h-fit sticky top-24">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Summary</h3>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span className={!shipping ? "text-green-600" : ""}>{shipping ? `₹${shipping}` : "FREE"}</span></div>
                <div className="border-t border-gray-100 dark:border-dark-600 pt-2.5 flex justify-between font-bold text-base text-gray-900 dark:text-white">
                  <span>Total</span><span>₹{(cartTotal + shipping).toLocaleString()}</span>
                </div>
              </div>
              {shipping > 0 && <p className="text-xs text-orange-500 mb-3">Add ₹{499 - cartTotal} more for FREE shipping!</p>}
              <Link to="/checkout" className="btn-primary w-full text-center py-3.5">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
