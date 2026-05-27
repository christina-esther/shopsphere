import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  HiArrowRight, HiOutlineLightningBolt, HiOutlineTruck,
  HiOutlineShieldCheck, HiOutlineRefresh, HiStar, HiChevronRight,
} from "react-icons/hi";
import { fetchProducts } from "../redux/slices/productSlice";
import { ProductCard, SkeletonCard, SectionHeader, PageWrapper } from "../components/ui/index";

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = ["Premium.", "Modern.", "Yours."];

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated BG */}
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <motion.div style={{ y, opacity }} className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-primary-200 dark:border-primary-800"
            >
              <HiOutlineLightningBolt className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Flash Sale — Up to 70% OFF</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white mb-6"
            >
              Shop the{" "}
              <span className="gradient-text">Future,</span>
              <br />
              <span className="gradient-text">Today.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed"
            >
              Discover curated collections of premium products. Free shipping on orders above ₹499.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/products" className="btn-primary text-base px-8 py-4 group">
                Shop Now
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/products?flashSale=true" className="btn-secondary text-base px-8 py-4">
                View Flash Sale 🔥
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "10K+", label: "Products" },
                { value: "4.9★", label: "Average Rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
                  <div className="text-xs text-gray-400 font-medium">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Floating product cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block h-[520px]"
          >
            {/* Main hero image */}
            <div className="absolute right-0 top-8 w-64 rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/20">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
                alt="Featured product"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 bg-white dark:bg-dark-700">
                <p className="font-bold text-gray-900 dark:text-white">Premium Watch</p>
                <p className="text-primary-600 font-black text-lg">₹4,999</p>
              </div>
            </div>

            {/* Floating card 1 */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-20 glass rounded-2xl p-4 shadow-xl w-48"
            >
              <img src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200" alt="AirPods" className="w-full h-28 object-cover rounded-xl mb-3" />
              <p className="text-sm font-bold text-gray-900 dark:text-white">AirPods Pro</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-primary-600 font-bold">₹24,999</p>
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">-17%</span>
              </div>
            </motion.div>

            {/* Floating card 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute left-12 bottom-8 glass rounded-2xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <HiStar className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">4.9/5 Rating</p>
                  <p className="text-xs text-gray-400">From 50K+ reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Floating card 3 */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute right-4 bottom-20 glass rounded-2xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <HiOutlineTruck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Free Delivery</p>
                  <p className="text-xs text-gray-400">Orders above ₹499</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Features Strip ───────────────────────────────────────────────────────────
function FeaturesStrip() {
  const features = [
    { icon: HiOutlineTruck, title: "Free Shipping", subtitle: "On orders ₹499+" },
    { icon: HiOutlineShieldCheck, title: "Secure Payment", subtitle: "100% secure checkout" },
    { icon: HiOutlineRefresh, title: "Easy Returns", subtitle: "30-day return policy" },
    { icon: HiOutlineLightningBolt, title: "Fast Delivery", subtitle: "2-5 business days" },
  ];

  return (
    <section className="py-10 border-y border-gray-100 dark:border-dark-700 bg-gray-50/50 dark:bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, subtitle }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Categories Grid ──────────────────────────────────────────────────────────
function CategoriesSection() {
  const cats = [
    { name: "Electronics", img: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400", slug: "electronics", color: "from-blue-500/20 to-purple-500/20" },
    { name: "Fashion", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", slug: "fashion", color: "from-pink-500/20 to-rose-500/20" },
    { name: "Home & Living", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", slug: "home-living", color: "from-amber-500/20 to-orange-500/20" },
    { name: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400", slug: "sports", color: "from-green-500/20 to-emerald-500/20" },
    { name: "Beauty", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400", slug: "beauty", color: "from-violet-500/20 to-fuchsia-500/20" },
    { name: "Books", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", slug: "books", color: "from-sky-500/20 to-cyan-500/20" },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <SectionHeader badge="Browse" title="Shop by Category" subtitle="Explore our wide range of curated categories" className="mb-12" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cats.map(({ name, img, slug, color }, i) => (
          <motion.div
            key={slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={`/products?category=${slug}`} className="group block">
              <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${color} aspect-square`}>
                <img
                  src={img}
                  alt={name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <p className="text-white text-sm font-bold">{name}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Trending Products ────────────────────────────────────────────────────────
function TrendingSection({ products, loading }) {
  return (
    <section className="py-20 bg-gray-50/80 dark:bg-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader badge="Hot Right Now" title="Trending Products" />
          <Link to="/products?trending=true" className="hidden sm:flex items-center gap-1.5 text-primary-600 font-semibold text-sm hover:gap-2.5 transition-all">
            View All <HiChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : products.slice(0, 8).map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))
          }
        </div>
      </div>
    </section>
  );
}

// ─── Flash Sale Banner ────────────────────────────────────────────────────────
function FlashSaleBanner() {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 p-8 sm:p-12"
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-white/5 rounded-full translate-y-1/3" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-3">
              <HiOutlineLightningBolt className="w-4 h-4" />
              <span className="text-sm font-bold">Flash Sale</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-2">Up to 70% OFF</h2>
            <p className="text-white/80 text-lg">Limited time deals on top brands</p>
          </div>
          <Link
            to="/products?flashSale=true"
            className="px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl text-lg hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 whitespace-nowrap"
          >
            Shop the Sale →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const reviews = [
    { name: "Priya Sharma", city: "Mumbai", rating: 5, text: "Absolutely love the products! Fast delivery and everything was exactly as described. Will definitely shop again.", avatar: "PS" },
    { name: "Rahul Verma", city: "Delhi", rating: 5, text: "Premium quality at great prices. The customer support team was incredibly helpful when I had questions.", avatar: "RV" },
    { name: "Ananya Singh", city: "Bangalore", rating: 5, text: "The app is beautiful and easy to use. My orders always arrive on time and the packaging is eco-friendly.", avatar: "AS" },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <SectionHeader badge="Testimonials" title="What Our Customers Say" subtitle="Join 50,000+ happy shoppers" className="mb-12" />
      <div className="grid sm:grid-cols-3 gap-6">
        {reviews.map(({ name, city, rating, text, avatar }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 card-lift"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(rating)].map((_, j) => <HiStar key={j} className="w-4 h-4 text-amber-400" />)}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">"{text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {avatar}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{name}</p>
                <p className="text-xs text-gray-400">{city}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ trending: true, limit: 8 }));
  }, []);

  return (
    <PageWrapper>
      <HeroSection />
      <FeaturesStrip />
      <CategoriesSection />
      <TrendingSection products={products} loading={loading} />
      <FlashSaleBanner />
      <TestimonialsSection />
    </PageWrapper>
  );
}
