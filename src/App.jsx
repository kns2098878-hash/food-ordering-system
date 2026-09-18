import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantMenu from "./pages/RestaurantMenu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Reservation from "./pages/Reservation";
import ReservationConfirmation from "./pages/ReservationConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Reservations from "./pages/Reservations";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMenu from "./pages/AdminMenu";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminOrders from "./pages/AdminOrders";
import AdminReservations from "./pages/AdminReservations";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
  path="/admin/reservations"
  element={<AdminReservations />}
/>
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id/menu" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>
        
        <Route path="/order-confirmation"
               element={<OrderConfirmation />}/>
        <Route
  path="/reservation"
  element={
    <ProtectedRoute>
      <Reservation />
    </ProtectedRoute>
  }
/>
        <Route
  path="/reservation-confirmation"
  element={<ReservationConfirmation />}
/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/admin/orders"
  element={<AdminOrders />}
/>
        <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  }
/>
        <Route
  path="/reservations"
  element={
    <ProtectedRoute>
      <Reservations />
    </ProtectedRoute>
  }
/>
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
        <Route
  path="/admin"
  element={<AdminDashboard />}
/>
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route
  path="/admin/restaurants"
  element={<AdminRestaurants />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
