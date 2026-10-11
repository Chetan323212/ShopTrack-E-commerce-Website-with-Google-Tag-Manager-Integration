/**
 * Google Tag Manager & GA4 E-commerce Event Telemetry Engine
 * Standardized in accordance with Google Analytics 4 Documentation:
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Helper to get active GTM & GA4 IDs (with localStorage overrides)
export const getTrackingConfig = () => {
  const defaultGtm = import.meta.env?.VITE_GTM_ID || "GTM-AURA99X";
  const defaultGa4 = import.meta.env?.VITE_GA4_MEASUREMENT_ID || "G-AURA99TEST";

  const gtmId = (typeof window !== "undefined" && localStorage.getItem("aura_gtm_id")) || defaultGtm;
  const ga4Id = (typeof window !== "undefined" && localStorage.getItem("aura_ga4_id")) || defaultGa4;
  const isDebugMode = (typeof window !== "undefined" && localStorage.getItem("aura_debug_mode") !== "false");

  return { gtmId, ga4Id, isDebugMode };
};

export const setTrackingConfig = (gtmId, ga4Id, isDebugMode = true) => {
  if (typeof window === "undefined") return;
  if (gtmId) localStorage.setItem("aura_gtm_id", gtmId.trim());
  if (ga4Id) localStorage.setItem("aura_ga4_id", ga4Id.trim());
  localStorage.setItem("aura_debug_mode", isDebugMode ? "true" : "false");
};

// Format product for standard GA4 item payload
export const formatGA4Item = (product, quantity = 1, index = 1) => {
  return {
    item_id: product.slug || product.id || String(product._id || ""),
    item_name: product.name,
    affiliation: "AURA Online Store",
    coupon: "",
    discount: product.originalPrice ? parseFloat((product.originalPrice - product.price).toFixed(2)) : 0,
    index: index,
    item_brand: product.brand || "AURA",
    item_category: product.category || "General",
    item_category2: product.badge || undefined,
    item_list_id: "catalog_grid",
    item_list_name: "AURA Product Catalog",
    item_variant: product.colors && product.colors.length > 0 ? product.colors[0] : undefined,
    price: parseFloat(Number(product.price).toFixed(2)),
    quantity: quantity,
  };
};

// Validate event data against official GA4 Ecommerce specifications
export const validateGA4Payload = (eventName, ecommerceData) => {
  const errors = [];
  const warnings = [];

  if (!eventName) errors.push("Missing event name");

  const eventsRequiringItems = [
    "view_item_list",
    "select_item",
    "view_item",
    "add_to_cart",
    "remove_from_cart",
    "view_cart",
    "begin_checkout",
    "add_shipping_info",
    "add_payment_info",
    "purchase",
  ];

  if (eventsRequiringItems.includes(eventName)) {
    if (!ecommerceData || !Array.isArray(ecommerceData.items) || ecommerceData.items.length === 0) {
      errors.push("Missing or empty 'items' array in ecommerce payload");
    } else {
      ecommerceData.items.forEach((item, idx) => {
        if (!item.item_id && !item.item_name) {
          errors.push(`Item at index ${idx} missing both item_id and item_name`);
        }
        if (typeof item.price !== "number" || isNaN(item.price)) {
          warnings.push(`Item '${item.item_name || idx}' has missing/non-numeric price`);
        }
      });
    }
  }

  if (["purchase"].includes(eventName)) {
    if (!ecommerceData?.transaction_id) {
      errors.push("Missing required 'transaction_id' for purchase event");
    }
    if (typeof ecommerceData?.value !== "number") {
      errors.push("Missing required numerical 'value' for purchase event");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Core push to window.dataLayer
export const pushDataLayer = (eventName, ecommerceData = {}, additionalParams = {}) => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  const { isDebugMode, ga4Id } = getTrackingConfig();

  // Reset previous ecommerce object to prevent parameter leakage (recommended by Google)
  window.dataLayer.push({ ecommerce: null });

  const eventPayload = {
    event: eventName,
    ecommerce: ecommerceData,
    debug_mode: isDebugMode ? true : undefined,
    ga4_measurement_id: ga4Id,
    ...additionalParams,
    _timestamp: new Date().toISOString(),
    _eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
  };

  window.dataLayer.push(eventPayload);

  // Validation audit
  const validation = validateGA4Payload(eventName, ecommerceData);
  eventPayload._validation = validation;

  // Broadcast to Live Debug Hub in the frontend UI
  window.dispatchEvent(
    new CustomEvent("aura:datalayer", {
      detail: eventPayload,
    })
  );

  // Formatted Console telemetry
  console.groupCollapsed(
    `%c[GA4 / GTM dataLayer] %c${eventName} %c${validation.isValid ? "✔ Valid" : "✖ Error"}`,
    "background: #7c3aed; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
    "color: #10b981; font-weight: bold;",
    validation.isValid ? "color: #34d399;" : "color: #f87171;"
  );
  console.log("Payload:", eventPayload);
  if (validation.warnings.length > 0) console.warn("Validation Warnings:", validation.warnings);
  if (validation.errors.length > 0) console.error("Validation Errors:", validation.errors);
  console.groupEnd();

  return eventPayload;
};

// 1. view_item_list (Item list or category catalog viewed)
export const trackViewItemList = (products, listName = "Catalog Grid") => {
  return pushDataLayer("view_item_list", {
    item_list_id: "catalog_view",
    item_list_name: listName,
    items: products.map((item, idx) => ({
      ...formatGA4Item(item, 1, idx + 1),
      item_list_name: listName,
    })),
  });
};

// 2. select_item (Product clicked from a list)
export const trackSelectItem = (product, listName = "Catalog Grid") => {
  return pushDataLayer("select_item", {
    item_list_id: "catalog_view",
    item_list_name: listName,
    items: [{
      ...formatGA4Item(product, 1, 1),
      item_list_name: listName,
    }],
  });
};

// 3. view_item (Product details viewed)
export const trackViewItem = (product) => {
  return pushDataLayer("view_item", {
    currency: "USD",
    value: parseFloat(Number(product.price).toFixed(2)),
    items: [formatGA4Item(product, 1, 1)],
  });
};

// 4. add_to_cart (Product variant added to cart)
export const trackAddToCart = (product, quantity = 1, selectedColor = "") => {
  const item = formatGA4Item(product, quantity, 1);
  if (selectedColor) item.item_variant = selectedColor;

  return pushDataLayer("add_to_cart", {
    currency: "USD",
    value: parseFloat((product.price * quantity).toFixed(2)),
    items: [item],
  });
};

// 5. remove_from_cart (Product removed from cart)
export const trackRemoveFromCart = (product, quantity = 1, selectedColor = "") => {
  const item = formatGA4Item(product, quantity, 1);
  if (selectedColor) item.item_variant = selectedColor;

  return pushDataLayer("remove_from_cart", {
    currency: "USD",
    value: parseFloat((product.price * quantity).toFixed(2)),
    items: [item],
  });
};

// 6. view_cart (User opens or views the cart drawer)
export const trackViewCart = (cartItems, totalValue) => {
  return pushDataLayer("view_cart", {
    currency: "USD",
    value: parseFloat(totalValue.toFixed(2)),
    items: cartItems.map((cartItem, idx) => ({
      ...formatGA4Item(cartItem.product, cartItem.quantity, idx + 1),
      item_variant: cartItem.selectedColor || undefined,
    })),
  });
};

// 7. begin_checkout (Checkout initiation step)
export const trackBeginCheckout = (cartItems, totalValue, coupon = "") => {
  return pushDataLayer("begin_checkout", {
    currency: "USD",
    value: parseFloat(totalValue.toFixed(2)),
    coupon: coupon || undefined,
    items: cartItems.map((cartItem, idx) => ({
      ...formatGA4Item(cartItem.product, cartItem.quantity, idx + 1),
      item_variant: cartItem.selectedColor || undefined,
    })),
  });
};

// 8. add_shipping_info (Shipping method / address step)
export const trackAddShippingInfo = (cartItems, totalValue, shippingTier = "Standard Express") => {
  return pushDataLayer("add_shipping_info", {
    currency: "USD",
    value: parseFloat(totalValue.toFixed(2)),
    shipping_tier: shippingTier,
    items: cartItems.map((cartItem, idx) => ({
      ...formatGA4Item(cartItem.product, cartItem.quantity, idx + 1),
      item_variant: cartItem.selectedColor || undefined,
    })),
  });
};

// 9. add_payment_info (Payment method selected)
export const trackAddPaymentInfo = (cartItems, totalValue, paymentType = "Credit Card") => {
  return pushDataLayer("add_payment_info", {
    currency: "USD",
    value: parseFloat(totalValue.toFixed(2)),
    payment_type: paymentType,
    items: cartItems.map((cartItem, idx) => ({
      ...formatGA4Item(cartItem.product, cartItem.quantity, idx + 1),
      item_variant: cartItem.selectedColor || undefined,
    })),
  });
};

// 10. purchase (Order authorized & completed)
export const trackPurchase = (orderId, cartItems, totalValue, tax = 0, shipping = 0, coupon = "") => {
  return pushDataLayer("purchase", {
    transaction_id: orderId,
    affiliation: "AURA Online Store",
    value: parseFloat(totalValue.toFixed(2)),
    tax: parseFloat(Number(tax).toFixed(2)),
    shipping: parseFloat(Number(shipping).toFixed(2)),
    currency: "USD",
    coupon: coupon || undefined,
    items: cartItems.map((cartItem, idx) => ({
      ...formatGA4Item(cartItem.product, cartItem.quantity, idx + 1),
      item_variant: cartItem.selectedColor || undefined,
    })),
  });
};

// 11. search (Search query performed)
export const trackSearch = (searchTerm) => {
  return pushDataLayer("search", {}, { search_term: searchTerm });
};
