// ── LoginPage ──────────────────────────────────────────────────────────────
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { loginUser } from "../redux/slices/authSlice";
import { PageWrapper } from "../components/ui/index";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { loading } = useSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (!result.error) navigate(from, { replace: true });
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center px-4 py-16 mesh-bg">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-7">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg font-black">S</span>
              </div>
            </Link>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your ShopSphere account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email address" className="input pl-11" />
            </div>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="input pl-11 pr-11" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline font-medium">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span> : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register free</Link>
          </p>
        </div>
      </motion.div>
    </PageWrapper>
  );
}

// ── RegisterPage ───────────────────────────────────────────────────────────
import { registerUser } from "../redux/slices/authSlice";
import { HiOutlineUser } from "react-icons/hi";

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPassReg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (!result.error) navigate("/");
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center px-4 py-16 mesh-bg">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-7">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg font-black">S</span>
              </div>
            </Link>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Create account</h1>
            <p className="text-gray-400 text-sm mt-1">Join ShopSphere for free</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={form.name} onChange={set("name")} required placeholder="Full name" className="input pl-11" />
            </div>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={form.email} onChange={set("email")} required placeholder="Email address" className="input pl-11" />
            </div>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPassReg ? "text" : "password"} value={form.password} onChange={set("password")} required minLength={6} placeholder="Password (min 6 chars)" className="input pl-11 pr-11" />
              <button type="button" onClick={() => setShowPassReg(!showPassReg)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassReg ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span> : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </PageWrapper>
  );
}

// ── ForgotPasswordPage ─────────────────────────────────────────────────────
import api from "../services/api";
import toast from "react-hot-toast";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center px-4 py-16 mesh-bg">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
            <HiOutlineMail className="w-8 h-8 text-primary-600" />
          </div>
          {sent ? (
            <>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Check your email</h1>
              <p className="text-gray-400 text-sm">We sent a password reset link to <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span></p>
              <Link to="/login" className="btn-primary mt-6 inline-block">Back to Sign In</Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Forgot password?</h1>
              <p className="text-gray-400 text-sm mb-6">Enter your email and we'll send you a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email address" className="input pl-11" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <Link to="/login" className="block mt-4 text-sm text-gray-400 hover:text-primary-600 transition-colors">← Back to Sign In</Link>
            </>
          )}
        </div>
      </motion.div>
    </PageWrapper>
  );
}

// ── ResetPasswordPage ──────────────────────────────────────────────────────
import { useParams } from "react-router-dom";

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, { password });
      localStorage.setItem("token", data.token);
      toast.success("Password reset successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center px-4 py-16 mesh-bg">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2 text-center">Set new password</h1>
          <p className="text-gray-400 text-sm text-center mb-6">Must be at least 6 characters</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="New password" className="input" />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} placeholder="Confirm new password" className="input" />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </motion.div>
    </PageWrapper>
  );
}

// ── ProfilePage ────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/users/profile", { name });
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); }
    finally { setLoading(false); }
  };

  return (
    <PageWrapper className="pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">My Profile</h1>
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-black text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-gray-400">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full capitalize">{user?.role}</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email</label>
              <input value={user?.email} readOnly className="input bg-gray-50 dark:bg-dark-600 cursor-not-allowed" />
            </div>
          </div>
          <button onClick={handleSave} disabled={loading} className="btn-primary px-8 py-3">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── NotFoundPage ───────────────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <PageWrapper className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-9xl font-black gradient-text">404</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Page not found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary text-lg px-8 py-4">Go Home</Link>
      </div>
    </PageWrapper>
  );
}

// Default exports for individual file usage
export { default as default } from "./WishlistPage";
