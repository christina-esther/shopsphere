import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiOutlineShoppingCart, HiOutlineTrash, HiPlus, HiMinus } from "react-icons/hi";
import { closeCart, removeFromCart, updateCartItem, selectCartTotal } from "../../redux/slices/cartSlice";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { items, cartOpen } = useSelector((s) => s.cart);
  const cartTotal = useSelector(selectCartTotal);
  const activeItems = items.filter((i) => !i.savedForLater);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white dark:bg-dark-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-dark-600">
              <div className="flex items-center gap-3">
                <HiOutlineShoppingCart className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
                <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full">
                  {activeItems.length}
                </span>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
              >
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <AnimatePresence>
                {activeItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full py-16 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center mb-4">
                      <HiOutlineShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h3>
                    <p className="text-sm text-gray-400 mb-6">Add items you love to your cart</p>
                    <button
                      onClick={() => dispatch(closeCart())}
                      className="btn-primary"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  activeItems.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-dark-700 group"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white dark:bg-dark-600">
                        <img
                          src={item.product?.images?.[0]?.url}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product?._id}`}
                          onClick={() => dispatch(closeCart())}
                          className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 line-clamp-2 transition-colors"
                        >
                          {item.product?.name}
                        </Link>
                        {item.variant && (
                          <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>
                        )}
                        <p className="text-sm font-bold text-primary-600 mt-1">
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-gray-200 dark:border-dark-500 rounded-lg overflow-hidden">
                            <button
                              onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity - 1 }))}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                            >
                              <HiMinus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                            >
                              <HiPlus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {activeItems.length > 0 && (
              <div className="p-5 border-t border-gray-100 dark:border-dark-600 bg-white dark:bg-dark-800">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({activeItems.length} items)</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">{cartTotal > 499 ? "FREE" : "₹49"}</span>
                  </div>
                  <div className="border-t border-gray-100 dark:border-dark-600 pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{(cartTotal + (cartTotal > 499 ? 0 : 49)).toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeCart())}
                  className="btn-primary w-full text-center text-base py-3.5"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => dispatch(closeCart())}
                  className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-2"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
