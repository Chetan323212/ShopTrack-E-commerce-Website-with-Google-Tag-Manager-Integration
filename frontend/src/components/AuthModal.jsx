import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
  const { showToast } = useCart();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        showToast("Signed in successfully! Welcome back.");
      } else {
        await register(name, email, password);
        showToast("Account created successfully! Welcome to AURA.");
      }
      setIsAuthModalOpen(false);
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminFill = () => {
    setEmail("admin@aura.store");
    setPassword("Admin@123456");
    setMode("login");
    setError("");
  };

  const handleQuickCustomerFill = () => {
    setEmail("customer@aura.store");
    setPassword("Customer@123456");
    setMode("login");
    setError("");
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="auth-modal-panel"
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-black text-white">
            {mode === "login" ? "Welcome Back to AURA" : "Create Studio Account"}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === "login"
              ? "Access your saved bag, tracked orders, and member perks."
              : "Join our community of audio enthusiasts and gear connoisseurs."}
          </p>
        </div>

        {/* Quick Demo Credentials Pill Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Quick 1-Click Credentials (Dev Demo)
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickAdminFill}
              className="flex-1 py-1.5 px-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3 text-brand-400" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={handleQuickCustomerFill}
              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserIcon className="w-3 h-3 text-emerald-400" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Full Name
              </label>
              <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white">
                <UserIcon className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white">
              <Mail className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Password
            </label>
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white">
              <Lock className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Processing..." : mode === "login" ? "Sign In to Account" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === "login" ? (
            <span>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="text-brand-400 hover:text-brand-300 font-bold ml-1 cursor-pointer"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="text-brand-400 hover:text-brand-300 font-bold ml-1 cursor-pointer"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
