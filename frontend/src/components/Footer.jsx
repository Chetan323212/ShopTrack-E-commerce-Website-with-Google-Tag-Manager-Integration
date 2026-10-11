import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Send,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { CATEGORIES } from "../data/products";

export const Footer = ({ onSelectCategory, onNavigateShop }) => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 2000);
    }
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 mt-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow bg-brand-900/20 w-96 h-96 -top-48 -left-20"></div>
      <div className="ambient-glow bg-cyan-900/15 w-96 h-96 -bottom-48 -right-20"></div>

      {/* Trust Badges Banner */}
      <div className="border-b border-slate-800/70 bg-slate-900/40 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all orders over $150 with tracked courier delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400">Not satisfied? Return easily with zero restocking fees</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">2-Year Official Warranty</h4>
              <p className="text-xs text-slate-400">Comprehensive hardware coverage on every original piece</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                AURA<span className="text-brand-400">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A curated technology and modern lifestyle studio. We design and partner with boutique creators to deliver timeless aesthetics, audiophile sound, and precision ergonomics.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Join the AURA Insider Club
              </div>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  You're in! Check your inbox for 10% off code: WELCOME10
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-l-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    id="newsletter-submit-button"
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-r-xl transition flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Collections
            </h5>
            <ul className="space-y-2.5 text-xs">
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onNavigateShop();
                    }}
                    className="text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Support */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Experience
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#order-lookup" onClick={(e) => e.preventDefault()} className="hover:text-white transition">Track Order Status</a></li>
              <li><a href="#shipping" onClick={(e) => e.preventDefault()} className="hover:text-white transition">Shipping Policy</a></li>
              <li><a href="#returns" onClick={(e) => e.preventDefault()} className="hover:text-white transition">Returns & Exchanges</a></li>
              <li><a href="#warranty" onClick={(e) => e.preventDefault()} className="hover:text-white transition">Warranty Registration</a></li>
              <li><a href="#faq" onClick={(e) => e.preventDefault()} className="hover:text-white transition">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Telemetry & Roadmap Specs */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Developer & GTM
            </h5>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1.5 text-slate-400 font-mono">
              <div className="flex items-center gap-1.5 text-brand-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                GTM Ready (W1-W3)
              </div>
              <p>dataLayer standard events</p>
              <p>React 19 + Tailwind v3</p>
              <p className="text-[10px] text-slate-500">MERN Stack Scaffold</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AURA Studio Inc. All rights reserved. Designed for discerning enthusiasts.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition" aria-label="X / Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
