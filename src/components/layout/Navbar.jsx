import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineShoppingCart, HiOutlineSearch, HiOutlineHeart,
  HiOutlineUser, HiOutlineSun, HiOutlineMoon, HiOutlineMenu,
  HiX, HiOutlineLogout, HiOutlineClipboardList, HiOutlineCog,
  HiChevronDown,
} from "react-icons/hi";
import { toggleTheme } from "../../redux/slices/uiSlice";
import { toggleCart } from "../../redux/slices/cartSlice";
import { logout } from "../../redux/slices/authSlice";
import { selectCartItemCount } from "../../redux/slices/cartSlice";
import {
  fetchSearchSuggestions, clearSuggestions,
} from "../../redux/slices/productSlice";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/products" },
  { label: "New Arrivals", path: "/products?sort=newest" },
  { label: "Sale", path: "/products?flashSale=true" },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector(selectCartItemCount);
  const wishlist = useSelector((s) => s.wishlist.ids);
  const { suggestions } = useSelector((s) => s.products);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Search debounce
  useEffect(() => {
    if (searchQuery.length < 2) { dispatch(clearSuggestions()); return; }
    const t = setTimeout(() => dispatch(fetchSearchSuggestions(searchQuery)), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <motion.nav
        initial={false}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-black/5 dark:shadow-black/30 py-3"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* ─── Logo ──────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow-sm">
                <span className="text-white text-lg font-black">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">
                Shop<span className="text-primary-600">Sphere</span>
              </span>
            </Link>

            {/* ─── Nav Links (desktop) ────────────────── */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === link.path
                      ? "text-primary-600 bg-primary-50 dark:bg-primary-950/40 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-600"
                    }`}
                >
                  {link.label}
                  {link.label === "Sale" && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">HOT</span>
                  )}
                </Link>
              ))}
            </div>

            {/* ─── Right Actions ──────────────────────── */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="btn-ghost p-2.5 rounded-xl"
                  aria-label="Search"
                >
                  <HiOutlineSearch className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-80 card p-3 shadow-xl"
                    >
                      <form onSubmit={handleSearch}>
                        <div className="relative">
                          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="input pl-9 py-2.5 text-sm"
                          />
                        </div>
                      </form>

                      {/* Suggestions */}
                      <AnimatePresence>
                        {suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 border-t border-gray-100 dark:border-dark-500 pt-2"
                          >
                            {suggestions.map((s) => (
                              <Link
                                key={s._id}
                                to={`/products/${s.slug || s._id}`}
                                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
                              >
                                <img src={s.images[0]?.url} alt={s.name} className="w-10 h-10 object-cover rounded-lg" />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{s.name}</p>
                                  <p className="text-xs text-primary-600 font-semibold">₹{s.price.toLocaleString()}</p>
                                </div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="btn-ghost p-2.5 rounded-xl"
                aria-label="Toggle theme"
              >
                {theme === "dark"
                  ? <HiOutlineSun className="w-5 h-5 text-yellow-400" />
                  : <HiOutlineMoon className="w-5 h-5" />
                }
              </button>

              {/* Wishlist */}
              {user && (
                <Link to="/wishlist" className="btn-ghost p-2.5 rounded-xl relative">
                  <HiOutlineHeart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlist.length > 9 ? "9+" : wishlist.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="btn-ghost p-2.5 rounded-xl relative"
                aria-label="Cart"
              >
                <HiOutlineShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center overflow-hidden">
                      {user.avatar?.url
                        ? <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                        : <span className="text-white text-sm font-bold">{user.name[0].toUpperCase()}</span>
                      }
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-48 card py-1.5 shadow-xl"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-500">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        {[
                          { icon: HiOutlineUser, label: "Profile", path: "/profile" },
                          { icon: HiOutlineClipboardList, label: "My Orders", path: "/orders" },
                          { icon: HiOutlineHeart, label: "Wishlist", path: "/wishlist" },
                          ...(user.role === "admin" ? [{ icon: HiOutlineCog, label: "Admin Panel", path: "/admin" }] : []),
                        ].map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-gray-100 dark:border-dark-500 mt-1"
                        >
                          <HiOutlineLogout className="w-4 h-4" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="hidden sm:block btn-ghost text-sm px-4 py-2">Sign in</Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2">Join free</Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden btn-ghost p-2.5 rounded-xl"
              >
                {mobileOpen ? <HiX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 dark:border-dark-600 bg-white dark:bg-dark-800"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-dark-600">
                    <Link to="/login" className="flex-1 btn-secondary text-center">Sign in</Link>
                    <Link to="/register" className="flex-1 btn-primary text-center">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16 sm:h-[72px]" />
    </>
  );
}
