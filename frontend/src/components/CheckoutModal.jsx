import React, { useState } from "react";
import {
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  trackPurchase,
  trackAddShippingInfo,
  trackAddPaymentInfo,
} from "../utils/gtm";
import { apiCreateOrder } from "../services/api";

export const CheckoutModal = ({ isOpen, onClose, onOrderCompleted }) => {
  const {
    cart,
    subtotal,
    discountAmount,
    shipping,
    estimatedTax,
    grandTotal,
    clearCart,
    promoCode,
  } = useCart();

  const [step, setStep] = useState("shipping"); // 'shipping' | 'payment' | 'success'
  const [shippingData, setShippingData] = useState({
    fullName: "Alex Mercer",
    email: "alex.mercer@example.com",
    address: "742 Evergreen Terrace",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [createdOrderId, setCreatedOrderId] = useState("");

  if (!isOpen) return null;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    trackAddShippingInfo(cart, grandTotal, "Standard Express");
    trackAddPaymentInfo(
      cart,
      grandTotal,
      paymentMethod === "apple" ? "Apple Pay" : "Credit Card"
    );
    setStep("payment");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderId = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
    setCreatedOrderId(orderId);

    // Save to Express REST API & MongoDB
    try {
      const savedUser = localStorage.getItem("aura_user");
      const token = savedUser ? JSON.parse(savedUser).token : "";
      const orderPayload = {
        orderId,
        orderItems: cart.map((item) => ({
          name: item.product.name,
          image: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
        })),
        shippingAddress: shippingData,
        paymentMethod: paymentMethod === "apple" ? "Apple Pay" : "Credit Card",
        subtotal,
        discount: discountAmount,
        shipping,
        tax: estimatedTax,
        grandTotal,
      };
      await apiCreateOrder(orderPayload, token);
    } catch (err) {
      console.warn("Backend order recording note:", err.message);
    }

    // Track standard GA4 Purchase event with coupon
    trackPurchase(orderId, cart, grandTotal, estimatedTax, shipping, promoCode);

    setStep("success");
    clearCart();
    if (onOrderCompleted) onOrderCompleted(orderId);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="checkout-modal-container"
        className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {step === "success" ? "Order Confirmed!" : "Secure 256-Bit SSL Checkout"}
            </h3>
          </div>
          {step !== "success" && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content depending on step */}
        <div className="p-6">
          {step === "shipping" && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Step 1 of 2: Shipping Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.fullName}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, fullName: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingData.email}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, email: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingData.address}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, address: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.city}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, city: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.state}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, state: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.postalCode}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, postalCode: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Total: <strong className="text-white">${grandTotal.toFixed(2)}</strong>
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              <div className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Step 2 of 2: Payment & Authorization
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex" },
                  { id: "apple", label: "Apple / Google Pay", desc: "1-Click biometric pay" },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl text-left border transition ${
                      paymentMethod === m.id
                        ? "bg-brand-600/20 border-brand-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{m.label}</div>
                    <div className="text-[10px] text-slate-400">{m.desc}</div>
                  </button>
                ))}
              </div>

              {/* Card Inputs Simulation */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Card Number
                  </label>
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                    <CreditCard className="w-4 h-4 text-slate-400 mr-2" />
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8821"
                      className="bg-transparent text-xs w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      defaultValue="•••"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Deliver to:</span>
                  <span className="text-white font-medium">{shippingData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-emerald-400 font-semibold">{shipping === 0 ? "FREE Express" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                  <span>Grand Total (Charged):</span>
                  <span className="text-brand-300 text-sm">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("shipping")}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Shipping
                </button>
                <button
                  id="complete-order-btn"
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-glow-emerald cursor-pointer"
                >
                  Authorize & Place Order (${grandTotal.toFixed(2)})
                </button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glow-emerald">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">
                  Payment Confirmed!
                </h4>
                <p className="text-xs text-slate-400">
                  Receipt and tracking dispatched to{" "}
                  <strong className="text-slate-200">{shippingData.email}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-sm mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="font-mono text-brand-300 font-bold">{createdOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GA4 Telemetry:</span>
                  <span className="text-emerald-400 font-semibold">purchase event dispatched</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Delivery:</span>
                  <span className="text-white font-medium">Within 3 business days</span>
                </div>
              </div>

              <button
                id="order-success-continue-btn"
                onClick={() => {
                  setStep("shipping");
                  onClose();
                }}
                className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow transition cursor-pointer"
              >
                Back to Shop Catalog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
