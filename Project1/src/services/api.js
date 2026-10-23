const API_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getRestaurants() {
  return request("/restaurants");
}

export function getRestaurant(id) {
  return request(`/restaurants/${id}`);
}

export function getRestaurantMenu(id) {
  return request(`/restaurants/${id}/menu`);
}

export function registerCustomer(data) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginCustomer(data) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getOrders() {
  return request("/orders");
}

export function placeOrder(data) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function checkReservationAvailability(params) {
  const query = new URLSearchParams(params).toString();
  return request(`/reservations/availability?${query}`);
}

export function createReservation(data) {
  return request("/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getReservations() {
  return request("/reservations");
}