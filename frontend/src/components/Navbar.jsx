import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ArrowRight,
  User,
  Shield,
  LogOut,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { trackSearch } from "../utils/gtm";
import { SAMPLE_PRODUCTS, CATEGORIES } from "../data/products";

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onNavigateHome,
  onNavigateShop,
  onSelectProduct,
  apiOnline,
}) => {
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const {
    user,
    isAuthenticated,
    isAdmin,
    setIsAuthModalOpen,
    setIsAdminModalOpen,
    logout,
  } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);

  // Predictive search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matches = SAMPLE_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      ).slice(0, 4);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      trackSearch(searchQuery.trim());
      setSuggestions([]);
      onNavigateShop();
    }
  };

  const handleSelectSuggestion = (product) => {
    setSuggestions([]);
    setSearchQuery("");
    onSelectProduct(product);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              id="navbar-brand-logo"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-cyan flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center">
                  AURA<span className="text-brand-400">.</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                  Studio Edition
                  {apiOnline ? (
                    <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono lowercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      api:online
                    </span>
                  ) : null}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                id="nav-link-home"
                onClick={onNavigateHome}
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition cursor-pointer"
              >
                Home
              </button>

              <button
                id="nav-link-shop"
                onClick={onNavigateShop}
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition cursor-pointer"
              >
                Explore Products
              </button>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  id="nav-categories-dropdown"
                  onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsCatDropdownOpen(false), 200)}
                  className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition flex items-center gap-1 cursor-pointer"
                >
                  Categories
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isCatDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 glass-dropdown rounded-xl shadow-2xl p-2 border border-slate-700 animate-slide-up z-50">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          onNavigateShop();
                          setIsCatDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                          selectedCategory === cat.id
                            ? "bg-brand-600 text-white"
                            : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[11px] opacity-60">({cat.count})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Search bar & Action buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop Search Bar with Instant Predictive Results */}
            <div className="relative hidden lg:block w-64 xl:w-80">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="desktop-search-input"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search headphones, gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-full pl-10 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-dropdown rounded-2xl shadow-2xl p-2 border border-slate-700/80 z-50 animate-slide-up">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Instant Suggestions
                  </div>
                  {suggestions.map((p) => (
                    <button
                      key={p.slug || p.id}
                      onClick={() => handleSelectSuggestion(p)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition text-left cursor-pointer group"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate group-hover:text-brand-300 transition">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p.category} • ${p.price.toFixed(2)}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search Toggle Icon */}
            <button
              id="mobile-search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Management Button (Visible if logged in as Admin) */}
            {isAdmin && (
              <button
                id="navbar-admin-btn"
                onClick={() => setIsAdminModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition shadow-glow-emerald cursor-pointer"
                title="Open Admin Product Management"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Studio</span>
              </button>
            )}

            {/* Auth User Pill */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="navbar-user-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 glass-dropdown rounded-xl shadow-2xl p-2 border border-slate-700 animate-slide-up z-50">
                    <div className="px-3 py-1.5 border-b border-slate-800 text-[11px]">
                      <div className="font-bold text-white truncate">{user?.name}</div>
                      <div className="text-slate-400 text-[10px] truncate">{user?.email}</div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsAdminModalOpen(true);
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-slate-800/80 text-left transition"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-slate-800/80 text-left transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="navbar-wishlist-button"
              onClick={onNavigateShop}
              className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button with Counter */}
            <button
              id="navbar-cart-button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 hover:text-white transition cursor-pointer shadow-glow"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-bold font-sans">
                {cartCount > 0 ? `${cartCount} items` : "Cart"}
              </span>
              {cartCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="navbar-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 pt-1 animate-slide-up">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-full pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/98 px-5 py-6 space-y-4 animate-slide-up">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                onNavigateHome();
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigateShop();
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-semibold"
            >
              Explore All Products
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setIsAdminModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-emerald-400 hover:bg-slate-800 text-sm font-semibold flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Product Studio
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    onNavigateShop();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                    selectedCategory === cat.id
                      ? "bg-brand-600 text-white"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
