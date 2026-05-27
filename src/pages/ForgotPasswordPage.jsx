import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineMail } from "react-icons/hi";
import api from "../services/api";
import toast from "react-hot-toast";


export default function ForgotPasswordPage() {
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
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 mesh-bg">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-5">
            <HiOutlineMail className="w-8 h-8 text-primary-600" />
          </div>
          {sent ? (
            <>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Check your email</h1>
              <p className="text-gray-400 text-sm">We sent a reset link to <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span></p>
              <Link to="/login" className="btn-primary mt-6 inline-block">Back to Sign In</Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Forgot password?</h1>
              <p className="text-gray-400 text-sm mb-6">Enter your email and we'll send a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email address" className="input pl-11" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">{loading ? "Sending..." : "Send Reset Link"}</button>
              </form>
              <Link to="/login" className="block mt-4 text-sm text-gray-400 hover:text-primary-600 transition-colors">← Back to Sign In</Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
