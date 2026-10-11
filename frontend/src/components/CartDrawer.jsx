import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  CheckCircle2,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { trackBeginCheckout } from "../utils/gtm";

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountPercent,
    discountAmount,
    shipping,
    estimatedTax,
    grandTotal,
    promoCode,
    applyPromoCode,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckoutClick = () => {
    trackBeginCheckout(cart, grandTotal);
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyPromoCode(inputCoupon);
      setInputCoupon("");
    }
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-slate-950 h-full flex flex-col border-l border-slate-800 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-brand-400" />
            <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
            <span className="text-xs bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((t, i) => t + i.quantity, 0)} items
            </span>
          </div>

          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck className="w-4 h-4 text-emerald-400" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-bold">You qualify for FREE Express Shipping!</span>
              ) : (
                <span>Add ${amountNeededForFreeShipping.toFixed(2)} more for Free Shipping</span>
              )}
            </span>
            <span className="text-[11px] text-slate-400">{Math.round(progressToFreeShipping)}%</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-800/80">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 flex items-center justify-center text-slate-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Your bag is currently empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Discover our award-winning headphones, mechanical keyboards, and smart essentials.
              </p>
              <button
                id="cart-continue-shopping-btn"
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-glow hover:bg-brand-500 transition"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.product.id}-${item.selectedColor}-${index}`} className="pt-4 first:pt-0 flex gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.selectedColor && (
                    <div className="text-[11px] text-brand-300 font-medium">
                      Variant: {item.selectedColor}
                    </div>
                  )}

                  <div className="text-xs font-bold text-slate-300">
                    ${item.product.price.toFixed(2)}
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedColor, item.quantity - 1)
                        }
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-l-lg"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedColor, item.quantity + 1)
                        }
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-r-lg"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400 ml-auto font-medium">
                      Total: ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary / Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-900/60 space-y-4">
            {/* Promo Code Input */}
            <div>
              {discountPercent > 0 ? (
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    Promo code "{promoCode}" applied ({discountPercent}% OFF)
                  </span>
                  <span className="font-extrabold">-${discountAmount.toFixed(2)}</span>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    id="promo-code-input"
                    type="text"
                    placeholder="Coupon code (e.g. AURA20)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-white font-semibold">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="text-white font-semibold">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
                <span>Estimated Total</span>
                <span className="text-brand-300 text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="proceed-checkout-btn"
              onClick={handleCheckoutClick}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
