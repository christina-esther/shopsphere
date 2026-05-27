import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiAdjustments, HiX, HiChevronDown, HiSearch } from "react-icons/hi";
import { fetchProducts } from "../redux/slices/productSlice";
import { ProductCard, SkeletonCard, EmptyState, PageWrapper } from "../components/ui/index";
import { HiOutlineShoppingBag } from "react-icons/hi";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
];

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home & Living", value: "home-living" },
  { label: "Sports", value: "sports" },
  { label: "Beauty", value: "beauty" },
  { label: "Books", value: "books" },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, loading, total, pages, page } = useSelector((s) => s.products);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [search, setSearch] = useState(searchParams.get("keyword") || "");
  const [currentPage, setCurrentPage] = useState(1);

  const category = searchParams.get("category") || "";
  const keyword = searchParams.get("keyword") || "";

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts({
      keyword: search || keyword,
      category,
      sort,
      page: currentPage,
      limit: 12,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] < 100000 ? priceRange[1] : undefined,
      rating: rating || undefined,
      flashSale: searchParams.get("flashSale") || undefined,
      trending: searchParams.get("trending") || undefined,
      featured: searchParams.get("featured") || undefined,
    }));
  }, [category, sort, currentPage, priceRange, rating, search, keyword, searchParams]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts();
  };

  const clearFilters = () => {
    setPriceRange([0, 100000]);
    setRating("");
    setSort("newest");
    setSearch("");
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <PageWrapper className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-dark-800 border-b border-gray-100 dark:border-dark-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                {keyword ? `Results for "${keyword}"` : category ? `${category.replace("-", " ")} Products` : "All Products"}
              </h1>
              <p className="text-gray-400 mt-1">{total} products found</p>
            </div>

            {/* Sort + Filter buttons */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                  className="appearance-none input py-2.5 pl-4 pr-9 text-sm min-w-[170px] cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all
                  ${filtersOpen ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-600" : "border-gray-200 dark:border-dark-500 text-gray-600 dark:text-gray-300 hover:border-gray-300"}`}
              >
                <HiAdjustments className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-4 relative max-w-lg">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input pl-11 pr-28 py-3"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4 text-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ opacity: 0, width: 0, x: -20 }}
                animate={{ opacity: 1, width: 260, x: 0 }}
                exit={{ opacity: 0, width: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="w-64 card p-5 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                    <button onClick={clearFilters} className="text-xs text-primary-600 font-semibold hover:underline">
                      Clear All
                    </button>
                  </div>

                  {/* Category */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            checked={category === value}
                            onChange={() => { setSearchParams((p) => { const n = new URLSearchParams(p); if (value) n.set("category", value); else n.delete("category"); return n; }); setCurrentPage(1); }}
                            className="accent-primary-600"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Price Range: ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1] >= 100000 ? "Any" : priceRange[1].toLocaleString()}
                    </h4>
                    <input
                      type="range" min={0} max={100000} step={500}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-primary-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>₹0</span><span>₹1,00,000+</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Minimum Rating</h4>
                    <div className="space-y-2">
                      {["", "4", "3", "2"].map((r) => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio" name="rating" checked={rating === r}
                            onChange={() => setRating(r)} className="accent-primary-600"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {r ? `${r}★ & above` : "All Ratings"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => { setCurrentPage(1); loadProducts(); }} className="btn-primary w-full py-2.5 text-sm">
                    Apply Filters
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={HiOutlineShoppingBag}
                title="No products found"
                subtitle="Try adjusting your filters or search term"
                action={<button onClick={clearFilters} className="btn-primary">Clear Filters</button>}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {items.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all
                          ${pg === currentPage ? "bg-primary-600 text-white shadow-glow-sm" : "bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600"}`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
