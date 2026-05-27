// ─────────────────────────────────────────────────────────────────────────────
// ProductCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiStar } from "react-icons/hi";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import { openAuthModal } from "../../redux/slices/uiSlice";

export function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const wishlistIds = useSelector((s) => s.wishlist.ids);
  const isWishlisted = wishlistIds.includes(product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) { dispatch(openAuthModal("login")); return; }
    dispatch(toggleWishlist(product._id));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) { dispatch(openAuthModal("login")); return; }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative"
    >
      <Link to={`/products/${product.slug || product._id}`} className="block">
        <div className="card overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-gray-50 dark:bg-dark-700 overflow-hidden">
            <img
              src={product.images?.[0]?.url || "https://via.placeholder.com/400x300"}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  -{discount}%
                </span>
              )}
              {product.trending && (
                <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
                  Trending
                </span>
              )}
              {product.flashSale?.active && (
                <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                  Flash Sale
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-2 py-0.5 bg-gray-800 text-white text-xs font-bold rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-dark-700 shadow-md
                         flex items-center justify-center opacity-0 group-hover:opacity-100
                         transition-all duration-200 hover:scale-110"
            >
              {isWishlisted
                ? <HiHeart className="w-5 h-5 text-red-500" />
                : <HiOutlineHeart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              }
            </button>

            {/* Add to cart overlay */}
            {product.stock > 0 && (
              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-gray-900/90 dark:bg-primary-600 text-white text-sm font-semibold
                             flex items-center justify-center gap-2 hover:bg-primary-600 dark:hover:bg-primary-700 transition-colors"
                >
                  <HiOutlineShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 font-medium uppercase tracking-wide">
              {product.brand || "ShopSphere"}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug">
              {product.name}
            </h3>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <HiStar key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.ratings) ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-400">({product.numReviews})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
              {product.comparePrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-orange-500 font-medium mt-1.5">
                Only {product.stock} left!
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SkeletonCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="h-5 skeleton rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StarRating.jsx
// ─────────────────────────────────────────────────────────────────────────────
export function StarRating({ rating, count, size = "md" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map((n) => (
          <HiStar key={n} className={`${s} ${n <= Math.round(rating) ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}`} />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-400">({count.toLocaleString()})</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeader.jsx
// ─────────────────────────────────────────────────────────────────────────────
export function SectionHeader({ badge, title, subtitle, className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-widest mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PageWrapper.jsx - animated page transition
// ─────────────────────────────────────────────────────────────────────────────
export function PageWrapper({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState.jsx
// ─────────────────────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center mb-5">
        {Icon && <Icon className="w-12 h-12 text-gray-300 dark:text-gray-600" />}
      </div>
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {subtitle && <p className="text-gray-400 dark:text-gray-500 mb-6 max-w-sm">{subtitle}</p>}
      {action}
    </motion.div>
  );
}
