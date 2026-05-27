import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineUser, HiPlus, HiX } from "react-icons/hi";
import api from "../../services/api";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// AdminUsers
// ─────────────────────────────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users", { params: { page, limit: 15, search: search || undefined } });
      setUsers(data.users);
      setTotal(data.total);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle`);
      toast.success("User status updated");
      fetchUsers();
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-400">{total} registered users</p>
        </div>
      </div>

      <div className="relative max-w-xs">
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search users..." className="input pl-10 py-2.5 text-sm" />
      </div>

      <div className="bg-white dark:bg-dark-700 rounded-2xl border border-gray-100 dark:border-dark-600 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-600 bg-gray-50 dark:bg-dark-600/50">
                {["User", "Email", "Role", "Joined", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-600">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>{[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-3/4" /></td>)}</tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
              ) : (
                users.map((u) => (
                  <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {u.name?.[0]?.toUpperCase() || <HiOutlineUser className="w-4 h-4" />}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${u.role === "admin" ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400" : "bg-gray-100 text-gray-600 dark:bg-dark-600 dark:text-gray-400"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {u.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(u._id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${u.isActive ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30" : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30"}`}>
                        {u.isActive ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 15 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-dark-600 flex items-center justify-between">
            <p className="text-xs text-gray-400">Page {page} of {Math.ceil(total / 15)}</p>
            <div className="flex gap-1.5">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-dark-600 disabled:opacity-40">Prev</button>
              <button disabled={page * 15 >= total} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-dark-600 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AdminCoupons
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_COUPON = {
  code: "", description: "", discountType: "percentage", discountValue: "",
  minOrderAmount: "0", maxDiscount: "", usageLimit: "", validUntil: "", isActive: true,
};

function CouponModal({ coupon, onClose, onSave }) {
  const [form, setForm] = useState(coupon || EMPTY_COUPON);
  const [saving, setSaving] = useState(false);
  const isEdit = !!coupon?._id;
  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        code: form.code.toUpperCase(),
      };
      if (isEdit) {
        await api.put(`/admin/coupons/${coupon._id}`, payload);
        toast.success("Coupon updated!");
      } else {
        await api.post("/admin/coupons", payload);
        toast.success("Coupon created!");
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white dark:bg-dark-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-dark-700 px-6 py-4 border-b border-gray-100 dark:border-dark-600 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">{isEdit ? "Edit Coupon" : "Create Coupon"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600"><HiX className="w-5 h-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Code*</label>
              <input value={form.code} onChange={set("code")} required placeholder="SAVE20" className="input uppercase font-mono" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Discount Type*</label>
              <select value={form.discountType} onChange={set("discountType")} className="input">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Discount Value*</label>
              <input type="number" value={form.discountValue} onChange={set("discountValue")} required min={1} placeholder={form.discountType === "percentage" ? "20" : "200"} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Min Order (₹)</label>
              <input type="number" value={form.minOrderAmount} onChange={set("minOrderAmount")} min={0} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Max Discount (₹)</label>
              <input type="number" value={form.maxDiscount} onChange={set("maxDiscount")} min={0} placeholder="Optional cap" className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Usage Limit</label>
              <input type="number" value={form.usageLimit} onChange={set("usageLimit")} min={1} placeholder="Unlimited" className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Valid Until*</label>
              <input type="datetime-local" value={form.validUntil} onChange={set("validUntil")} required className="input" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="active" checked={form.isActive} onChange={set("isActive")} className="accent-primary-600 w-4 h-4" />
              <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-dark-600">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">{saving ? "Saving..." : isEdit ? "Update" : "Create"}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/coupons");
      setCoupons(data.coupons);
    } catch { toast.error("Failed to load coupons"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch { toast.error("Failed to delete"); }
  };

  const openEdit = (c) => { setSelectedCoupon(c); setShowModal(true); };
  const openCreate = () => { setSelectedCoupon(null); setShowModal(true); };
  const handleSave = () => { setShowModal(false); fetchCoupons(); };

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Coupons</h1>
          <p className="text-sm text-gray-400">{coupons.length} coupon codes</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2"><HiPlus className="w-4 h-4" /> Add Coupon</button>
      </div>

      <div className="bg-white dark:bg-dark-700 rounded-2xl border border-gray-100 dark:border-dark-600 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-600 bg-gray-50 dark:bg-dark-600/50">
                {["Code", "Type", "Value", "Min Order", "Used", "Expires", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-600">
              {loading ? (
                [...Array(4)].map((_, i) => <tr key={i}>{[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-3/4" /></td>)}</tr>)
              ) : coupons.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No coupons yet. Create one!</td></tr>
              ) : (
                coupons.map((c) => (
                  <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary-600 dark:text-primary-400 text-sm">{c.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{c.discountType}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                      {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">₹{c.minOrderAmount}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.usedCount}/{c.usageLimit || "∞"}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(c.validUntil).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isActive && new Date(c.validUntil) > new Date() ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {c.isActive && new Date(c.validUntil) > new Date() ? "Active" : "Expired"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors text-xs font-semibold">Edit</button>
                        <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors text-xs font-semibold">Del</button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <CouponModal coupon={selectedCoupon} onClose={() => setShowModal(false)} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  );
}

export default AdminUsers;
