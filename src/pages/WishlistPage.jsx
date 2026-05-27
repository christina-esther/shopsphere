// WishlistPage
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineHeart } from "react-icons/hi";
import { Link } from "react-router-dom";
import { ProductCard, EmptyState, PageWrapper } from "../components/ui/index";
import { motion } from "framer-motion";

export function WishlistPage() {
  const { items } = useSelector((s) => s.wishlist);
  return (
    <PageWrapper className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">My Wishlist ({items.length})</h1>
        {items.length === 0 ? (
          <EmptyState icon={HiOutlineHeart} title="Your wishlist is empty"
            subtitle="Save items you love to your wishlist"
            action={<Link to="/products" className="btn-primary">Explore Products</Link>} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {items.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default WishlistPage;
