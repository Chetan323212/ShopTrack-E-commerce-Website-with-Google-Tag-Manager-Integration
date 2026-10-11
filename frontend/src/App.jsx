import React, { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { ProductListing } from "./components/ProductListing";
import { ProductDetails } from "./components/ProductDetails";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { QuickViewModal } from "./components/QuickViewModal";
import { GTMDebugHub } from "./components/GTMDebugHub";
import { Toast } from "./components/Toast";
import { AuthModal } from "./components/AuthModal";
import { AdminProductModal } from "./components/AdminProductModal";
import { SAMPLE_PRODUCTS } from "./data/products";
import { apiGetProducts } from "./services/api";

export function App() {
  // Products state (synchronized with Express REST API)
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [apiOnline, setApiOnline] = useState(false);

  // Navigation & View State
  const [activeView, setActiveView] = useState("home"); // 'home' | 'shop' | 'details'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Load products from Express backend REST API
  const loadBackendProducts = async () => {
    try {
      const data = await apiGetProducts();
      if (data && data.length > 0) {
        setProducts(data);
        setApiOnline(true);
      } else {
        setApiOnline(false);
      }
    } catch {
      setApiOnline(false);
    }
  };

  useEffect(() => {
    loadBackendProducts();
  }, []);

  // Navigation Handlers
  const handleNavigateHome = () => {
    setActiveView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateShop = () => {
    setActiveView("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveView("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleDirectCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#070a13] text-slate-100 font-sans selection:bg-brand-500 selection:text-white relative">
          {/* Top Sticky Navigation */}
          <Navbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNavigateHome={handleNavigateHome}
            onNavigateShop={handleNavigateShop}
            onSelectProduct={handleSelectProduct}
            apiOnline={apiOnline}
          />

          {/* Dynamic Main Body Content */}
          <main className="flex-1 w-full">
            {activeView === "home" && (
              <Home
                products={products}
                onNavigateShop={handleNavigateShop}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  handleNavigateShop();
                }}
                onSelectProduct={handleSelectProduct}
                onQuickView={handleQuickView}
              />
            )}

            {activeView === "shop" && (
              <ProductListing
                products={products}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onSelectProduct={handleSelectProduct}
                onQuickView={handleQuickView}
              />
            )}

            {activeView === "details" && selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                allProducts={products}
                onBack={handleNavigateShop}
                onSelectProduct={handleSelectProduct}
                onDirectCheckout={handleDirectCheckout}
              />
            )}
          </main>

          {/* Global Footer */}
          <Footer
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              handleNavigateShop();
            }}
            onNavigateShop={handleNavigateShop}
          />

          {/* Slide-out Cart Drawer */}
          <CartDrawer
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
          />

          {/* Fast Checkout Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onOrderCompleted={(orderId) => {
              console.log("Order finalized:", orderId);
            }}
          />

          {/* Quick View Modal */}
          <QuickViewModal
            product={quickViewProduct}
            isOpen={Boolean(quickViewProduct)}
            onClose={() => setQuickViewProduct(null)}
            onOpenFullDetails={handleSelectProduct}
          />

          {/* User Sign In & Sign Up Modal */}
          <AuthModal />

          {/* Admin Product Management Studio Modal */}
          <AdminProductModal
            products={products}
            onProductMutated={loadBackendProducts}
          />

          {/* Live GTM Preview & GA4 DebugView Telemetry Hub */}
          <GTMDebugHub />

          {/* Interactive Toast Notifications */}
          <Toast />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
