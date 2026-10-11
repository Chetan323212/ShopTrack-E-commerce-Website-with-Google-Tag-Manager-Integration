import React from "react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Headphones,
  Watch,
  Laptop,
  Lamp,
  Shield,
  Star,
  Tag,
} from "lucide-react";
import { Hero } from "./Hero";
import { ProductCard } from "./ProductCard";
import { CATEGORIES } from "../data/products";

const CATEGORY_MAP = [
  { id: "Audio", name: "Audiophile Sound", icon: Headphones, desc: "ANC & studio acoustics", count: "2 Models" },
  { id: "Wearables", name: "Titanium Wearables", icon: Watch, desc: "Precision bio-tracking", count: "1 Model" },
  { id: "Computing", name: "Pro Computing", icon: Laptop, desc: "Keyboards & 4K sensors", count: "2 Models" },
  { id: "Smart Living", name: "Ambient Lighting", icon: Lamp, desc: "Circadian desk bars", count: "1 Model" },
  { id: "Accessories", name: "Modern EDC", icon: Shield, desc: "Cordura & MagSafe", count: "2 Models" },
];

export const Home = ({
  products,
  onNavigateShop,
  onSelectCategory,
  onSelectProduct,
  onQuickView,
}) => {
  const featuredProduct = products.find((p) => p.id === "aura-h1-anc") || products[0];
  const trendingProducts = products.filter((p) => p.isFeatured || p.rating >= 4.8).slice(0, 4);

  return (
    <div id="home-view" className="space-y-16 animate-fade-in">
      {/* 1. Hero Showcase */}
      <Hero
        onExploreClick={(cat) => {
          if (cat && typeof cat === "string") onSelectCategory(cat);
          onNavigateShop();
        }}
        onSelectProduct={onSelectProduct}
        featuredProduct={featuredProduct}
      />

      {/* 2. Visual Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Engineered For Every Passion
            </h2>
          </div>
          <button
            onClick={onNavigateShop}
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORY_MAP.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onNavigateShop();
                }}
                className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-brand-500/50 cursor-pointer transition text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[11px] text-slate-500 font-medium">{cat.count}</div>
                <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured / Trending Releases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Community Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trending In The Studio
            </h2>
          </div>
          <button
            onClick={onNavigateShop}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <span>Explore Entire Catalog ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 4. Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-brand-500/40 p-8 sm:p-12 bg-gradient-to-r from-brand-900/60 via-slate-900 to-indigo-950/70 shadow-2xl">
          <div className="ambient-glow bg-brand-500/30 w-72 h-72 -top-20 -right-20"></div>

          <div className="relative z-10 max-w-xl space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              <Tag className="w-3.5 h-3.5" />
              <span>Limited Promotional Code</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              Claim 20% Off Your Entire Order
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use code <strong className="text-brand-300 font-mono px-2 py-0.5 rounded bg-black/40 border border-brand-400/30">AURA20</strong> at checkout to apply an instant 20% discount on any flagship headphones, smartwatch, or mechanical gear.
            </p>

            <div className="pt-2">
              <button
                onClick={onNavigateShop}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow transition flex items-center gap-2 cursor-pointer"
              >
                <span>Shop With Code Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Enthusiast Feedback
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Loved By Tech Devotees
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Elena Rostova",
              role: "Creative Director",
              quote: "The Aura ANC headphones have replaced my studio monitors during late night mixing. The acoustics and battery longevity are peerless.",
              product: "Aura Studio Pro Wireless ANC",
            },
            {
              name: "Marcus Vance",
              role: "Senior Software Architect",
              quote: "The Vortex 75 mechanical keyboard has the cleanest acoustic profile I have ever felt. Typing for 10 hours a day is pure bliss.",
              product: "Vortex 75 Mechanical Keyboard",
            },
            {
              name: "Devon Chen",
              role: "Ultra-Marathon Athlete",
              quote: "Chrono Apex titanium smartwatch took a beating during my alpine trek and kept tracking GPS without missing a beat.",
              product: "Chrono Apex Titanium Watch",
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-left space-y-3"
            >
              <div className="flex text-amber-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role}</div>
                <div className="text-[10px] text-brand-400 mt-0.5">Purchased: {t.product}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
