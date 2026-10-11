import React, { useState, useMemo, useEffect } from "react";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  Star,
  Check,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import { CategoryBar } from "./CategoryBar";
import { trackViewItemList, trackSearch } from "../utils/gtm";
import { CATEGORIES } from "../data/products";

export const ProductListing = ({
  products,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onQuickView,
}) => {
  // Filter States
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(600);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.name.toLowerCase().includes(q);
          const matchesBrand = p.brand.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesTags = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesBrand && !matchesDesc && !matchesTags) {
            return false;
          }
        }

        // Max price filter
        if (p.price > maxPrice) {
          return false;
        }

        // Rating filter
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }

        // In-stock filter
        if (inStockOnly && !p.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        // default: featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, inStockOnly, sortBy]);

  // Track view_item_list when category or filter changes
  useEffect(() => {
    trackViewItemList(filteredProducts, `Catalog - ${selectedCategory}`);
  }, [selectedCategory, filteredProducts]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(600);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    searchQuery.trim() !== "" ||
    maxPrice < 600 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div id="product-listing-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-1">
            Catalog & Inventory
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {selectedCategory === "all" ? "Explore All Products" : `${selectedCategory} Collection`}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Showing <span className="text-white font-bold">{filteredProducts.length}</span> results tailored to your preferences.
          </p>
        </div>

        {/* View toggles & Sort on desktop */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            id="mobile-filters-trigger"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <Filter className="w-3.5 h-3.5 text-brand-400" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="sort-products-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <option value="featured" className="bg-slate-900">Sort: Featured</option>
              <option value="price-low" className="bg-slate-900">Price: Low to High</option>
              <option value="price-high" className="bg-slate-900">Price: High to Low</option>
              <option value="rating" className="bg-slate-900">Highest Rated</option>
              <option value="name" className="bg-slate-900">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Grid/List View switcher */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              id="view-grid-btn"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "grid" ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              id="view-list-btn"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "list" ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="my-4">
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Active Filters:
          </span>

          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory("all")} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery("")} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {maxPrice < 600 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300">
              Max Price: ${maxPrice}
              <button onClick={() => setMaxPrice(600)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300">
              Min Rating: {minRating}★+
              <button onClick={() => setMinRating(0)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300">
              In-Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-400 hover:text-rose-300 underline ml-auto font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter Panel */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                <span>Filter Options</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Price Ceiling</span>
                <span className="text-brand-300 font-bold">${maxPrice}</span>
              </div>
              <input
                id="price-range-slider"
                type="range"
                min="50"
                max="600"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$50</span>
                <span>$300</span>
                <span>$600+</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-300">Minimum Rating</div>
              <div className="space-y-1.5">
                {[
                  { label: "All Ratings", val: 0 },
                  { label: "4.5 Stars & above", val: 4.5 },
                  { label: "4.0 Stars & above", val: 4.0 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setMinRating(item.val)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition cursor-pointer ${
                      minRating === item.val
                        ? "bg-brand-600/30 text-brand-300 border border-brand-500/40"
                        : "hover:bg-slate-800/60 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Star className={`w-3.5 h-3.5 ${item.val > 0 ? "fill-amber-400 text-amber-400" : ""}`} />
                      <span>{item.label}</span>
                    </div>
                    {minRating === item.val && <Check className="w-3.5 h-3.5 text-brand-300" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-300">In Stock Only</span>
                <input
                  id="in-stock-checkbox"
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Product Cards Grid / List */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 px-4 glass-panel rounded-3xl border border-slate-800 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your active filters or search terms. Try adjusting your price range or clearing filters.
              </p>
              <button
                id="reset-filters-empty-btn"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-glow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="glass-card p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-brand-500/40 transition flex flex-col sm:flex-row items-center gap-5 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full sm:w-36 h-36 object-cover rounded-xl bg-slate-950 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5 text-left w-full">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <span>{product.brand}</span>
                      <span>•</span>
                      <span className="text-brand-400 font-semibold">{product.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-white hover:text-brand-300 transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-current" : "text-slate-600"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-300">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-lg font-extrabold text-white">
                      ${product.price.toFixed(2)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-glow"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fade-in lg:hidden">
          <div className="w-full max-w-xs bg-slate-950 h-full p-6 overflow-y-auto space-y-6 animate-slide-up border-l border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Filters & Sorting</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Max Price:</span>
                <span className="text-brand-300 font-bold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            {/* Min Rating */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Min Rating</div>
              {[0, 4.0, 4.5].map((val) => (
                <button
                  key={val}
                  onClick={() => setMinRating(val)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                    minRating === val ? "bg-brand-600 text-white" : "bg-slate-900 text-slate-300"
                  }`}
                >
                  {val === 0 ? "Any rating" : `${val}+ Stars`}
                </button>
              ))}
            </div>

            {/* Stock */}
            <div>
              <label className="flex items-center justify-between text-xs text-slate-300">
                <span>In-stock only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-brand-500"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:text-white border border-slate-800"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-xs font-bold text-white shadow-glow"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
