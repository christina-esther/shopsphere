import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineClipboardList, HiOutlineHeart, HiOutlineLocationMarker } from "react-icons/hi";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { PageWrapper } from "../components/ui/index";

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/users/profile", { name, phone });
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update"); }
    finally { setLoading(false); }
  };

  const stats = [
    { icon: HiOutlineClipboardList, label: "My Orders", path: "/orders", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
    { icon: HiOutlineHeart, label: "Wishlist", path: "/wishlist", color: "bg-red-100 dark:bg-red-900/30 text-red-600" },
    { icon: HiOutlineLocationMarker, label: "Addresses", path: "/profile", color: "bg-green-100 dark:bg-green-900/30 text-green-600" },
  ];

  return (
    <PageWrapper className="pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">My Profile</h1>

        {/* Avatar + name */}
        <div className="card p-6 mb-5 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-black text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full capitalize">{user?.role}</span>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {stats.map(({ icon: Icon, label, path, color }) => (
            <Link key={path + label} to={path} className="card p-4 text-center hover:shadow-product transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</p>
            </Link>
          ))}
        </div>

        {/* Edit form */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Edit Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email</label>
              <input value={user?.email} readOnly className="input bg-gray-50 dark:bg-dark-600 cursor-not-allowed opacity-60" />
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
