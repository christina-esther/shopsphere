import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiStar, HiOutlineHeart, HiHeart, HiOutlineShoppingCart,
  HiOutlineLightningBolt, HiOutlineTruck, HiOutlineShieldCheck,
  HiOutlineRefresh, HiMinus, HiPlus, HiChevronRight, HiOutlineShare,
} from "react-icons/hi";
import { fetchProduct, clearCurrentProduct } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { openAuthModal } from "../redux/slices/uiSlice";
import { ProductCard, StarRating, PageWrapper } from "../components/ui/index";

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { currentProduct: product, productLoading, relatedProducts, reviews } = useSelector((s) => s.products);
  const wishlistIds = useSelector((s) => s.wishlist.ids);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeTab, setActiveTab] = useState("description");
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const isWishlisted = product ? wishlistIds.includes(product._id) : false;

  useEffect(() => {
    dispatch(fetchProduct(id));
    return () => dispatch(clearCurrentProduct());
  }, [id]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleAddToCart = () => {
    if (!user) { dispatch(openAuthModal("login")); return; }
    const variantStr = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ");
    dispatch(addToCart({ productId: product._id, quantity, variant: variantStr }));
  };

  const handleWishlist = () => {
    if (!user) { dispatch(openAuthModal("login")); return; }
    dispatch(toggleWishlist(product._id));
  };

  if (productLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-3">
            <div className="aspect-square skeleton rounded-2xl" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-square skeleton rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-8 skeleton rounded-xl" style={{ width: `${70 - i * 8}%` }} />)}
          </div>
        </div>
      </div>
    );
  }

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <PageWrapper className="pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <HiChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          <HiChevronRight className="w-4 h-4" />
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Image Gallery ── */}
          <div className="space-y-3">
            {/* Main image with zoom */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-700 cursor-zoom-in"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images?.[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={zoom ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: "scale(1.8)",
                } : {}}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                    {discount}% OFF
                  </span>
                )}
                {product.flashSale?.active && (
                  <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                    <HiOutlineLightningBolt className="w-3.5 h-3.5" /> Flash
                  </span>
                )}
              </div>

              {/* Share button */}
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 dark:bg-dark-700/80 backdrop-blur flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors shadow">
                <HiOutlineShare className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail row */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all
                      ${selectedImage === i ? "border-primary-500 shadow-glow-sm" : "border-transparent hover:border-gray-300 dark:hover:border-dark-400"}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Details ── */}
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-1">{product.brand || "ShopSphere"}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={product.ratings} size="lg" />
                <span className="text-sm text-gray-500">{product.numReviews} reviews</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-sm text-green-600 font-medium">{product.sold || 0} sold</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
              {product.comparePrice > product.price && (
                <div>
                  <span className="text-xl text-gray-400 line-through block">₹{product.comparePrice.toLocaleString()}</span>
                  <span className="text-sm text-green-600 font-bold">You save ₹{(product.comparePrice - product.price).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">
                    {product.stock <= 5 ? `Only ${product.stock} left!` : "In Stock"}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm text-red-500 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants?.map((variant) => (
              <div key={variant.name}>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {variant.name}: <span className="font-normal">{selectedVariants[variant.name] || "Select"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants((v) => ({ ...v, [variant.name]: opt }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                        ${selectedVariants[variant.name] === opt
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                          : "border-gray-200 dark:border-dark-500 hover:border-gray-300 text-gray-700 dark:text-gray-300"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 dark:border-dark-500 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
                  >
                    <HiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
                  >
                    <HiPlus className="w-4 h-4" />
                  </button>
                </div>

                <button onClick={handleAddToCart} className="btn-primary flex-1 py-3.5 text-base">
                  <HiOutlineShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={handleWishlist}
                  className="w-13 h-13 p-3.5 rounded-xl border-2 border-gray-200 dark:border-dark-500 hover:border-red-300 dark:hover:border-red-700 transition-all"
                >
                  {isWishlisted
                    ? <HiHeart className="w-5 h-5 text-red-500" />
                    : <HiOutlineHeart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  }
                </button>
              </div>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: HiOutlineTruck, text: "Free shipping above ₹499" },
                { icon: HiOutlineShieldCheck, text: "1 Year warranty" },
                { icon: HiOutlineRefresh, text: "30-day easy returns" },
                { icon: HiOutlineLightningBolt, text: "Fast 2–5 day delivery" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description, Reviews ── */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 dark:border-dark-600 gap-6 mb-6">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize transition-all relative
                  ${activeTab === tab
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
              >
                {tab === "reviews" ? `Reviews (${product.numReviews})` : "Description"}
                {activeTab === tab && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "description" ? (
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.tags.map((t) => (
                    <span key={t} className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 text-sm rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : reviews.map((review) => (
                <div key={review._id} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {review.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.user?.name}</p>
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      {review.title && <p className="font-medium text-sm text-gray-700 dark:text-gray-300 mt-1">{review.title}</p>}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Related Products ── */}
        {relatedProducts?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
