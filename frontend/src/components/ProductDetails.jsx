import React, { useState, useEffect } from "react";
import {
  Star,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Share2,
  Zap,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { trackViewItem } from "../utils/gtm";

export const ProductDetails = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onDirectCheckout,
}) => {
  const { addToCart, wishlist, toggleWishlist, showToast } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs"); // 'specs' | 'features' | 'reviews'

  const isSaved = wishlist.some((p) => p.id === product.id);

  // Trigger GA4 / GTM view_item event on load
  useEffect(() => {
    trackViewItem(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  // Handle Share link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!", "info");
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    onDirectCheckout();
  };

  // Related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div id="product-details-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <button
          id="back-to-catalog-btn"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Home</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-white font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Share product link"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Gallery (Thumbnails + Main Image) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center p-4">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.badge && (
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-lg bg-brand-600 text-white shadow-md">
                  {product.badge}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-lg bg-rose-600 text-white shadow-md">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Wishlist floating toggle */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-xl border transition-all z-10 ${
                isSaved
                  ? "bg-rose-500/90 border-rose-400 text-white shadow-lg"
                  : "bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Interactive Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-brand-500 shadow-glow scale-105"
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details & Buy Area */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Brand & Category */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest">
              <span>{product.brand}</span>
              <span>•</span>
              <span className="text-slate-400">{product.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {product.name}
            </h1>
          </div>

          {/* Rating & Stock */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-current text-amber-400"
                        : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-200">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewsCount} verified reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>In Stock ({product.stockCount} left)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-slate-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Color Variants */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-300">
                Color Finish: <span className="text-brand-300 font-bold">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedColor === c
                        ? "bg-brand-600 text-white shadow-glow"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4">
              {/* Counter */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-base cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount || 10, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-base cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                id="details-add-to-cart-btn"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>

            {/* Instant Buy Now */}
            <button
              id="details-buy-now-btn"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Instant Checkout Now</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <Truck className="w-4 h-4 mx-auto text-brand-400 mb-1" />
              <div className="text-[11px] font-bold text-slate-200">Express Delivery</div>
              <div className="text-[10px] text-slate-500">2-4 Business Days</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <RotateCcw className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
              <div className="text-[11px] font-bold text-slate-200">30-Day Returns</div>
              <div className="text-[10px] text-slate-500">Zero restocking fee</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <ShieldCheck className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
              <div className="text-[11px] font-bold text-slate-200">2-Year Warranty</div>
              <div className="text-[10px] text-slate-500">Official coverage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Tabs: Specs, Key Features, Customer Reviews */}
      <div className="mt-16 pt-10 border-t border-slate-800">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
          {[
            { id: "specs", label: "Technical Specifications" },
            { id: "features", label: "Engineered Highlights" },
            { id: "reviews", label: `Customer Reviews (${product.reviewsCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-bold pb-2 border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "specs" && (
            <div className="max-w-2xl divide-y divide-slate-800">
              {product.specs &&
                Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="py-3 flex justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-slate-400">{key}</span>
                    <span className="font-medium text-white">{value}</span>
                  </div>
                ))}
            </div>
          )}

          {activeTab === "features" && (
            <div className="max-w-2xl space-y-3">
              {product.features &&
                product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-200">{feat}</span>
                  </div>
                ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-2xl space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-white">{product.rating} out of 5</div>
                  <div className="text-xs text-slate-400">Based on {product.reviewsCount} customer submissions</div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Alexander M.</span>
                    <span className="text-slate-500">Verified Buyer • 3 days ago</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-xs text-slate-300">
                    Exceeded expectations. The build quality feels substantial, sound clarity is astonishing, and delivery arrived ahead of schedule.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Sophia R.</span>
                    <span className="text-slate-500">Verified Buyer • 1 week ago</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <p className="text-xs text-slate-300">
                    Incredible attention to packaging and materials. Seamlessly connected to my devices without issues.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Similar In {product.category}</h3>
              <p className="text-xs text-slate-400">Other enthusiast-favorite equipment you may like</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-brand-500/50 cursor-pointer space-y-3 transition"
              >
                <img
                  src={rel.images[0]}
                  alt={rel.name}
                  className="w-full aspect-square object-cover rounded-xl bg-slate-950"
                />
                <div>
                  <h4 className="text-sm font-bold text-white truncate">{rel.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-extrabold text-white">${rel.price.toFixed(2)}</span>
                    <span className="text-xs text-brand-400 font-semibold">{rel.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
