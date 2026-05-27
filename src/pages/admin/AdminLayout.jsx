import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineChartBar, HiOutlineShoppingBag, HiOutlineClipboardList,
  HiOutlineUsers, HiOutlineTag, HiOutlineLogout, HiOutlineMenu,
  HiX, HiOutlineBell, HiOutlineSearch, HiOutlineSun, HiOutlineMoon,
} from "react-icons/hi";
import { logout } from "../../redux/slices/authSlice";
import { toggleTheme } from "../../redux/slices/uiSlice";

const NAV = [
  { path: "/admin", label: "Dashboard", icon: HiOutlineChartBar, exact: true },
  { path: "/admin/products", label: "Products", icon: HiOutlineShoppingBag },
  { path: "/admin/orders", label: "Orders", icon: HiOutlineClipboardList },
  { path: "/admin/users", label: "Users", icon: HiOutlineUsers },
  { path: "/admin/coupons", label: "Coupons", icon: HiOutlineTag },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.ui);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow-sm">
            <span className="text-white text-lg font-black">S</span>
          </div>
          <div>
            <span className="font-bold text-white text-base">ShopSphere</span>
            <span className="block text-[10px] text-gray-500 font-medium uppercase tracking-widest -mt-0.5">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ path, label, icon: Icon, exact }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${isActive(path, exact)
                ? "bg-primary-600 text-white shadow-glow-sm"
                : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
            {isActive(path, exact) && (
              <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-all"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-950 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-60 bg-gray-950 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-4 sm:px-6 py-3.5 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
          >
            <HiOutlineMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Page title */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {NAV.find((n) => isActive(n.path, n.exact))?.label || "Admin"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500 dark:text-gray-400 transition-colors"
            >
              {theme === "dark" ? <HiOutlineSun className="w-5 h-5 text-yellow-400" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500 dark:text-gray-400 transition-colors relative">
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link
              to="/"
              className="hidden sm:block text-xs font-semibold text-primary-600 hover:underline"
            >
              ← View Store
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
