import React, { useState } from "react";
import { X, Star, ShoppingBag, Eye, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export const QuickViewModal = ({ product, isOpen, onClose, onOpenFullDetails }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product && product.colors ? product.colors[0] : ""
  );
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    onClose();
  };

  return (
    <div
      id="quick-view-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="quick-view-dialog"
        className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative grid grid-cols-1 sm:grid-cols-2">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Product Image */}
          <div className="bg-slate-900/40 p-6 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-800">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-2xl"
            />
          </div>

          {/* Details & Fast actions */}
          <div className="p-6 flex flex-col justify-between space-y-4 text-left">
            <div>
              <div className="text-[11px] font-bold text-brand-400 uppercase tracking-wider mb-1">
                {product.brand} • {product.category}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? "fill-current"
                          : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-300">{product.rating}</span>
                <span className="text-[11px] text-slate-500">({product.reviewsCount})</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-extrabold text-white mb-3">
                ${product.price.toFixed(2)}
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 mb-3">
                {product.description}
              </p>

              {/* Color Finish */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-semibold text-slate-300">
                    Finish: <span className="text-brand-300">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                          selectedColor === c
                            ? "bg-brand-600 text-white"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                id="quick-add-btn"
                onClick={handleAddToCart}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                id="view-full-details-btn"
                onClick={() => {
                  onClose();
                  onOpenFullDetails(product);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1 transition"
              >
                <span>View Full Details & Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
