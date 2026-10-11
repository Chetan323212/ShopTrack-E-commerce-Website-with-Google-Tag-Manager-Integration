const API_BASE_URL = "http://localhost:5000/api";

const getHeaders = (token = "") => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// ----------------- PRODUCTS API -----------------
export const apiGetProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.category && params.category !== "all") query.append("category", params.category);
    if (params.maxPrice) query.append("maxPrice", params.maxPrice);
    if (params.sort) query.append("sort", params.sort);
    if (params.inStock) query.append("inStock", "true");

    const url = `${API_BASE_URL}/products?${query.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.warn("Backend API unavailable, falling back to local dataset:", err.message);
    return null; // Signals caller to use local fallback
  }
};

export const apiGetProductById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error("Product fetch failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend product detail failed, using local product:", err.message);
    return null;
  }
};

export const apiCreateProduct = async (productData, token) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create product");
  }
  return await res.json();
};

export const apiUpdateProduct = async (id, productData, token) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update product");
  }
  return await res.json();
};

export const apiDeleteProduct = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete product");
  }
  return await res.json();
};

// ----------------- AUTH API -----------------
export const apiLogin = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }
  return await res.json();
};

export const apiRegister = async (name, email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }
  return await res.json();
};

// ----------------- CART API -----------------
export const apiGetCart = async (token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to load remote cart");
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const apiSyncCart = async (items, promoCode, discountPercent, token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ items, promoCode, discountPercent }),
    });
    if (!res.ok) throw new Error("Cart sync failed");
    return await res.json();
  } catch (err) {
    return null;
  }
};

// ----------------- ORDERS API -----------------
export const apiCreateOrder = async (orderData, token = "") => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to submit order to server");
  }
  return await res.json();
};
