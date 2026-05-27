import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiSearch, HiX, HiOutlinePhotograph } from "react-icons/hi";
import api from "../../services/api";
import toast from "react-hot-toast";

const EMPTY_PRODUCT = {
  name: "", description: "", price: "", comparePrice: "",
  category: "", brand: "", stock: "", featured: false, trending: false,
  images: [{ url: "" }], tags: "",
};

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const isEdit = !!product?._id;

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
        price: Number(form.price),
        comparePrice: Number(form.comparePrice) || 0,
        stock: Number(form.stock),
        tags: typeof form.tags === "string" ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : form.tags,
        images: form.images.filter((img) => img.url),
      };
      if (isEdit) {
        await api.put(`/products/${product._id}`, payload);
        toast.success("Product updated!");
      } else {
        await api.post("/products", payload);
        toast.success("Product created!");
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-dark-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-dark-700 px-6 py-4 border-b border-gray-100 dark:border-dark-600 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
            <HiX className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Product Name*</label>
              <input value={form.name} onChange={set("name")} required className="input" placeholder="e.g. Sony WH-1000XM5" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description*</label>
              <textarea value={form.description} onChange={set("description")} required rows={3}
                className="input resize-none" placeholder="Describe the product..." />
            </div>
            <div>
              <label className="label">Price (₹)*</label>
              <input type="number" value={form.price} onChange={set("price")} required min={0} className="input" placeholder="2999" />
            </div>
            <div>
              <label className="label">Compare Price (₹)</label>
              <input type="number" value={form.comparePrice} onChange={set("comparePrice")} min={0} className="input" placeholder="3999" />
            </div>
            <div>
              <label className="label">Category*</label>
              <select value={form.category} onChange={set("category")} required className="input">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Brand</label>
              <input value={form.brand} onChange={set("brand")} className="input" placeholder="Sony" />
            </div>
            <div>
              <label className="label">Stock*</label>
              <input type="number" value={form.stock} onChange={set("stock")} required min={0} className="input" placeholder="100" />
            </div>
            <div>
              <label className="label">Tags (comma separated)</label>
              <input value={typeof form.tags === "string" ? form.tags : form.tags?.join(", ")}
                onChange={set("tags")} className="input" placeholder="wireless, sony, headphones" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Image URL</label>
              <input value={form.images?.[0]?.url || ""}
                onChange={(e) => setForm((f) => ({ ...f, images: [{ url: e.target.value }] }))}
                className="input" placeholder="https://images.unsplash.com/..." />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} className="accent-primary-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.trending} onChange={set("trending")} className="accent-primary-600 w-4 h-4" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-dark-600">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
              {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { keyword: search, page, limit: 10 } });
      setProducts(data.products);
      setTotal(data.total);
    } catch { toast.error("Failed to load products"); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data.categories);
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch { toast.error("Failed to delete"); }
  };

  const openCreate = () => { setModalProduct(null); setShowModal(true); };
  const openEdit = (p) => { setModalProduct(p); setShowModal(true); };
  const closeModal = () => setShowModal(false);
  const handleSave = () => { closeModal(); fetchProducts(); };

  return (
    <div className="space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-400">{total} total products</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <HiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..." className="input pl-10 py-2.5 text-sm" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-700 rounded-2xl border border-gray-100 dark:border-dark-600 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-600 bg-gray-50 dark:bg-dark-600/50">
                {["Product", "Category", "Price", "Stock", "Sold", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-600">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">No products found</td>
                </tr>
              ) : (
                products.map((p) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-dark-600/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-600 flex-shrink-0">
                          {p.images?.[0]?.url
                            ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                            : <HiOutlinePhotograph className="w-6 h-6 text-gray-400 m-auto" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">₹{p.price.toLocaleString()}</p>
                      {p.comparePrice > p.price && (
                        <p className="text-xs text-gray-400 line-through">₹{p.comparePrice.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-orange-500" : "text-gray-700 dark:text-gray-300"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.sold || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {p.featured && <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-0.5 rounded-full font-bold w-fit">Featured</span>}
                        {p.trending && <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold w-fit">Trending</span>}
                        {!p.featured && !p.trending && <span className="text-[10px] text-gray-400">Active</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors">
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 10 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-dark-600 flex items-center justify-between">
            <p className="text-xs text-gray-400">Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}</p>
            <div className="flex gap-1.5">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-dark-600 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors">Prev</button>
              <button disabled={page * 10 >= total} onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-dark-600 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-dark-500 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <ProductModal
            product={modalProduct}
            categories={categories}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
