const API_BASE = "http://127.0.0.1:5000/api/v1";

/**
 * Retrieve auth token from localStorage
 */
export function getAuthToken() {
  return localStorage.getItem("foodie_token");
}

/**
 * Retrieve current user from localStorage
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("foodie_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Save auth state to localStorage
 */
export function setAuthState(user, token) {
  if (token) localStorage.setItem("foodie_token", token);
  if (user) localStorage.setItem("foodie_user", JSON.stringify(user));
  // Keep backward compatibility
  if (user?.id) localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Clear auth state
 */
export function clearAuthState() {
  localStorage.removeItem("foodie_token");
  localStorage.removeItem("foodie_user");
  localStorage.removeItem("user");
}

/**
 * Centralized fetch wrapper with auto-auth and error parsing
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const currentUser = getCurrentUser();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(currentUser?.id ? { "X-User-Id": String(currentUser.id) } : {}),
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get("content-type") || "";

    let data;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, err.message);
    throw err;
  }
}

// ==========================================
// AUTHENTICATION
// ==========================================

export async function loginCustomer(credentials) {
  const res = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  if (res.user && res.token) {
    setAuthState(res.user, res.token);
  }
  return res;
}

export async function registerCustomer(data) {
  const res = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.user && res.token) {
    setAuthState(res.user, res.token);
  }
  return res;
}

export async function getMe() {
  return apiRequest("/auth/me");
}

export async function updateProfile(data) {
  const res = await apiRequest("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (res.user) {
    const curToken = getAuthToken();
    setAuthState(res.user, curToken);
  }
  return res;
}

export function logoutUser() {
  clearAuthState();
  return apiRequest("/auth/logout", { method: "POST" }).catch(() => {});
}

// ==========================================
// RESTAURANTS & MENU
// ==========================================

export function getRestaurants(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const queryString = q.toString() ? `?${q.toString()}` : "";
  return apiRequest(`/restaurants${queryString}`);
}

export function getRestaurant(id) {
  return apiRequest(`/restaurants/${id}`);
}

export function getRestaurantMenu(id) {
  return apiRequest(`/restaurants/${id}/menu`);
}

export function getMenuItem(id) {
  return apiRequest(`/restaurants/menu-items/${id}`);
}

export function getCategories() {
  return apiRequest("/restaurants/categories");
}

// ==========================================
// CART
// ==========================================

export function getCart() {
  return apiRequest("/cart");
}

export function addToCart(item) {
  return apiRequest("/cart/items", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function updateCartItem(cartItemId, updates) {
  return apiRequest(`/cart/items/${cartItemId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function removeCartItem(cartItemId) {
  return apiRequest(`/cart/items/${cartItemId}`, {
    method: "DELETE",
  });
}

export function clearCart() {
  return apiRequest("/cart/clear", { method: "DELETE" });
}

// ==========================================
// ORDERS & CHECKOUT
// ==========================================

export function calculateOrderPreview(payload) {
  return apiRequest("/orders/calculate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function placeOrder(orderData) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export function getOrders(userId = null) {
  const path = userId ? `/orders/${userId}` : "/orders";
  return apiRequest(path);
}

export function getOrderDetail(orderId) {
  return apiRequest(`/orders/${orderId}/detail`);
}

export function cancelOrder(orderId, reason = "Customer cancelled") {
  return apiRequest(`/orders/${orderId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// ==========================================
// RESERVATIONS
// ==========================================

export function checkReservationAvailability(params) {
  const q = new URLSearchParams(params).toString();
  return apiRequest(`/reservations/availability?${q}`);
}

export function createReservation(data) {
  return apiRequest("/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getReservations(userId = null) {
  const path = userId ? `/reservations/${userId}` : "/reservations";
  return apiRequest(path);
}

export function getReservationDetail(resId) {
  return apiRequest(`/reservations/${resId}/detail`);
}

export function cancelReservation(resId) {
  return apiRequest(`/reservations/${resId}/cancel`, {
    method: "POST",
  });
}

// ==========================================
// REVIEWS & FAVORITES
// ==========================================

export function getRestaurantReviews(restaurantId) {
  return apiRequest(`/restaurants/${restaurantId}/reviews`);
}

export function submitReview(restaurantId, data) {
  return apiRequest(`/restaurants/${restaurantId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getFavorites() {
  return apiRequest("/favorites");
}

export function addFavorite(restaurantId) {
  return apiRequest("/favorites", {
    method: "POST",
    body: JSON.stringify({ restaurant_id: restaurantId }),
  });
}

export function removeFavorite(restaurantId) {
  return apiRequest(`/favorites/${restaurantId}`, {
    method: "DELETE",
  });
}

// ==========================================
// COUPONS & ADDRESSES
// ==========================================

export function getCoupons() {
  return apiRequest("/coupons");
}

export function validateCoupon(code, subtotal) {
  return apiRequest("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

export function getAddresses() {
  return apiRequest("/addresses");
}

export function createAddress(data) {
  return apiRequest("/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteAddress(id) {
  return apiRequest(`/addresses/${id}`, {
    method: "DELETE",
  });
}

// ==========================================
// ADMIN DASHBOARD & MANAGEMENT
// ==========================================

export function getAdminDashboard() {
  return apiRequest("/admin/dashboard");
}

export function getAdminOrders() {
  return apiRequest("/admin/orders");
}

export function updateAdminOrderStatus(orderId, status, notes = "") {
  return apiRequest(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes }),
  });
}

export function getAdminReservations() {
  return apiRequest("/admin/reservations");
}

export function updateAdminReservationStatus(resId, status, notes = "") {
  return apiRequest(`/admin/reservations/${resId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes }),
  });
}

export function createAdminRestaurant(data) {
  return apiRequest("/admin/restaurants", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminRestaurant(id, data) {
  return apiRequest(`/admin/restaurants/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteAdminRestaurant(id) {
  return apiRequest(`/admin/restaurants/${id}`, {
    method: "DELETE",
  });
}

export function createAdminMenuItem(data) {
  return apiRequest("/admin/menu-items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminMenuItem(id, data) {
  return apiRequest(`/admin/menu-items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteAdminMenuItem(id) {
  return apiRequest(`/admin/menu-items/${id}`, {
    method: "DELETE",
  });
}

export function getAdminAuditLogs() {
  return apiRequest("/admin/audit-logs");
}


// ==========================================
// ADVANCED DATABASE FEATURES: WALLET & LOYALTY
// ==========================================

export function getWallet() {
  return apiRequest("/wallet");
}

export function topupWallet(amount) {
  return apiRequest("/wallet/topup", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export function getLoyaltyStatus() {
  return apiRequest("/loyalty");
}

export function getDietaryTags() {
  return apiRequest("/dietary-tags");
}

export function trackOrder(orderId) {
  return apiRequest(`/orders/${orderId}/track`);
}
