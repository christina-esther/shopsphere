import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiEye, HiEyeOff, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import { loginUser, registerUser } from "../../redux/slices/authSlice";
import { closeAuthModal, setAuthTab } from "../../redux/slices/uiSlice";

export default function AuthModal() {
  const dispatch = useDispatch();
  const { authModalOpen, authModalTab: tab } = useSelector((s) => s.ui);
  const { loading } = useSelector((s) => s.auth);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = tab === "login"
      ? loginUser({ email: form.email, password: form.password })
      : registerUser(form);
    const result = await dispatch(action);
    if (!result.error) dispatch(closeAuthModal());
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeAuthModal())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card p-8 relative">
                <button
                  onClick={() => dispatch(closeAuthModal())}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                >
                  <HiX className="w-5 h-5 text-gray-400" />
                </button>

                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl font-black">S</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tab === "login" ? "Welcome back" : "Join ShopSphere"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {tab === "login" ? "Sign in to your ShopSphere account" : "Create your free account"}
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-dark-700 rounded-xl p-1 mb-6">
                  {["login", "register"].map((t) => (
                    <button
                      key={t}
                      onClick={() => dispatch(setAuthTab(t))}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 capitalize
                        ${tab === t
                          ? "bg-white dark:bg-dark-600 shadow text-gray-900 dark:text-white"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                      {t === "login" ? "Sign In" : "Register"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {tab === "register" && (
                    <div className="relative">
                      <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Full name"
                        required
                        className="input pl-10"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="Email address"
                      required
                      className="input pl-10"
                    />
                  </div>

                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder="Password"
                      required
                      minLength={6}
                      className="input pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
                    {loading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {tab === "login" ? "Signing in..." : "Creating account..."}
                      </span>
                    ) : tab === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>

                {tab === "login" && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    <button
                      className="text-primary-600 hover:underline font-medium"
                      onClick={() => dispatch(closeAuthModal())}
                    >
                      Forgot your password?
                    </button>
                  </p>
                )}

                {/* Demo hint */}
                <div className="mt-5 p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-800/30">
                  <p className="text-xs text-primary-700 dark:text-primary-300 font-medium mb-1">Demo login:</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">user@shopsphere.com / user123</p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
