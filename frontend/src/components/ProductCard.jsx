import React from "react";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { trackSelectItem } from "../utils/gtm";

export const ProductCard = ({ product, onSelectProduct, onQuickView }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isSaved = wishlist.some((p) => p.id === product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    trackSelectItem(product);
    onSelectProduct(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, product.colors ? product.colors[0] : "");
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    trackSelectItem(product);
    onQuickView(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="glass-card group rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer border border-slate-800/80 bg-slate-900/40 hover:border-brand-500/50 hover:bg-slate-900/70 transition-all duration-300 relative"
    >
      {/* Card Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950/60 flex items-center justify-center p-4">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-brand-600/90 text-white shadow-sm backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-rose-600/90 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Wishlist button */}
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={handleToggleWishlist}
            aria-label="Add to wishlist"
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              isSaved
                ? "bg-rose-500 text-white shadow-md scale-105"
                : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>

          {/* Quick view button */}
          <button
            id={`quickview-btn-${product.id}`}
            onClick={handleQuickView}
            aria-label="Quick view product"
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Stock warning pill */}
        {product.stockCount && product.stockCount < 15 && (
          <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
            Only {product.stockCount} left
          </div>
        )}
      </div>

      {/* Card Info Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span>{product.brand}</span>
            <span className="text-brand-400 font-semibold">{product.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-current text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-300">{product.rating}</span>
            <span className="text-[11px] text-slate-500">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-glow hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
