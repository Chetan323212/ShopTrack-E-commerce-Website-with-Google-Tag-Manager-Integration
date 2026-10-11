import React from "react";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star } from "lucide-react";

export const Hero = ({ onExploreClick, onSelectProduct, featuredProduct }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-24">
      {/* Dynamic ambient lights */}
      <div className="ambient-glow bg-brand-600/25 w-[500px] h-[500px] -top-32 -left-32"></div>
      <div className="ambient-glow bg-indigo-600/20 w-[450px] h-[450px] top-20 right-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Autumn 2026 Studio Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Curated Hardware for the{" "}
              <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-accent-cyan bg-clip-text text-transparent">
                Discerning Creator
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Experience audiophile-grade wireless acoustics, CNC mechanical keyboards, and precision aerospace wearables crafted with uncompromising refinement.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-explore-btn"
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-glow flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-deals-btn"
                onClick={() => onExploreClick("Audio")}
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Explore Audio Gear
              </button>
            </div>

            {/* Micro value-props */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
              <div className="space-y-0.5">
                <div className="text-lg font-extrabold text-white">4.9 / 5.0</div>
                <div className="text-[11px] text-slate-400">Over 3,200 Reviews</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-extrabold text-white">48hr</div>
                <div className="text-[11px] text-slate-400">Express Delivery</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg font-extrabold text-white">2 Years</div>
                <div className="text-[11px] text-slate-400">Direct Warranty</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Card */}
          {featuredProduct && (
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md glass-card rounded-3xl p-6 border border-slate-700/70 shadow-2xl bg-slate-900/50 backdrop-blur-2xl">
                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 z-20 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Featured Flagship</span>
                </div>

                {/* Showcase image */}
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-950 mb-5 border border-slate-800">
                  <img
                    src={featuredProduct.images[0]}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-xs font-semibold text-brand-300">
                    {featuredProduct.category}
                  </div>
                </div>

                {/* Information */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {featuredProduct.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {featuredProduct.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Starting at</span>
                      <span className="text-2xl font-black text-white">
                        ${featuredProduct.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      id="hero-featured-view-btn"
                      onClick={() => onSelectProduct(featuredProduct)}
                      className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-glow flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
