import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Check,
  AlertCircle,
  Package,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
} from "../services/api";

export const AdminProductModal = ({ products, onProductMutated }) => {
  const { isAdminModalOpen, setIsAdminModalOpen, user, isAdmin } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState("list"); // 'list' | 'add'
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "Aura Soundworks",
    category: "Audio",
    price: "",
    originalPrice: "",
    stockCount: 15,
    badge: "New Release",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAdminModalOpen) return null;

  const handleStartAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      brand: "Aura Soundworks",
      category: "Audio",
      price: "",
      originalPrice: "",
      stockCount: 15,
      badge: "New Release",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      description: "",
    });
    setActiveTab("add");
  };

  const handleStartEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || "",
      stockCount: prod.stockCount || 10,
      badge: prod.badge || "",
      image: prod.images && prod.images.length > 0 ? prod.images[0] : "",
      description: prod.description || "",
    });
    setActiveTab("add");
  };

  const handleDelete = async (prod) => {
    if (!window.confirm(`Are you sure you want to delete "${prod.name}"?`)) return;

    try {
      await apiDeleteProduct(prod.slug || prod.id || prod._id, user?.token);
      showToast(`Product "${prod.name}" deleted from MongoDB`);
      onProductMutated();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stockCount: Number(formData.stockCount),
        badge: formData.badge,
        images: [formData.image],
        description: formData.description,
      };

      if (editingProduct) {
        await apiUpdateProduct(
          editingProduct.slug || editingProduct.id || editingProduct._id,
          payload,
          user?.token
        );
        showToast(`Product "${formData.name}" updated successfully!`);
      } else {
        await apiCreateProduct(payload, user?.token);
        showToast(`New product "${formData.name}" added to MongoDB!`);
      }

      onProductMutated();
      setActiveTab("list");
      setEditingProduct(null);
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="admin-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setIsAdminModalOpen(false)}
    >
      <div
        id="admin-modal-panel"
        className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Admin Product Management</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                  Express + MongoDB
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Logged in as: <strong className="text-slate-200">{user?.name || "Admin"}</strong> ({user?.email})
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-3 px-6 pt-4 border-b border-slate-800 bg-slate-900/40">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === "list"
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            All Products Catalog ({products.length})
          </button>
          <button
            onClick={handleStartAdd}
            className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "add"
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{editingProduct ? "Edit Product" : "Add New Product"}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "list" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Manage inventory directly synchronized with the Express backend REST API.
                </span>
                <button
                  onClick={handleStartAdd}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1 transition shadow-glow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Item</span>
                </button>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/30">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {products.map((prod) => (
                      <tr key={prod.slug || prod.id || prod._id} className="hover:bg-slate-800/40">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white truncate max-w-xs">
                              {prod.name}
                            </div>
                            <div className="text-[10px] text-slate-400">{prod.brand}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-white">
                          ${prod.price.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.inStock
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {prod.stockCount || 10} in stock
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(prod)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "add" && (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    placeholder="e.g. Aura Spatial Audio Hub"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Computing">Computing</option>
                    <option value="Smart Living">Smart Living</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    placeholder="199.99"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Original / MSRP ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    placeholder="249.99"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    placeholder="e.g. New Release, Bestseller"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  High-Res Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
                  placeholder="Engineered for high fidelity and comfort..."
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow transition disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? "Submitting to DB..."
                    : editingProduct
                    ? "Update Product in DB"
                    : "Add Product to DB"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
