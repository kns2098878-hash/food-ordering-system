import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  DollarSign, 
  ShoppingBag, 
  CalendarDays, 
  Users, 
  UtensilsCrossed, 
  TrendingUp, 
  ShieldCheck, 
  Settings, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { getAdminDashboard } from "../services/api";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admin metrics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper container">
        <div className="skeleton" style={{ height: "180px", borderRadius: "var(--radius-xl)", marginBottom: "32px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="skeleton" style={{ height: "120px", borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    total_customers: 0,
    total_restaurants: 0,
    total_orders: 0,
    total_reservations: 0,
    total_revenue: 0,
  };

  const popularItems = data?.popular_items || [];
  const salesChart = data?.sales_chart || [];

  return (
    <div className="page-wrapper container" style={{ maxWidth: "1140px" }}>
      {/* Top Header */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "36px"
      }}>
        <div>
          <span className="badge badge-warning" style={{ marginBottom: "8px" }}>
            <ShieldCheck size={14} /> System Administrator
          </span>
          <h1 style={{ fontSize: "2.4rem", fontWeight: "800", fontFamily: "var(--font-serif)" }}>
            Foodie Platform Analytics
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Real-time MySQL performance metrics, restaurant operations, and revenue insights.
          </p>
        </div>

        {/* Quick Management Navigation Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/admin/restaurants" className="btn-secondary btn-sm">
            Manage Restaurants
          </Link>
          <Link to="/admin/menu" className="btn-secondary btn-sm">
            Manage Menu Items
          </Link>
          <Link to="/admin/orders" className="btn-secondary btn-sm">
            Orders Feed
          </Link>
          <Link to="/admin/reservations" className="btn-primary btn-sm">
            Reservations Feed
          </Link>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "18px",
        marginBottom: "40px"
      }}>
        <div className="foodie-card" style={{ padding: "22px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
            Total Revenue
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--primary-600)" }}>
            ₹{Number(summary.total_revenue).toFixed(2)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--success)", marginTop: "4px" }}>
            + Verified Net Receipts
          </div>
        </div>

        <div className="foodie-card" style={{ padding: "22px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
            Orders Placed
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: "800" }}>
            {summary.total_orders}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            All Dining Orders
          </div>
        </div>

        <div className="foodie-card" style={{ padding: "22px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
            Table Bookings
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: "800" }}>
            {summary.total_reservations}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Active & Completed
          </div>
        </div>

        <div className="foodie-card" style={{ padding: "22px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
            Active Kitchens
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: "800" }}>
            {summary.total_restaurants}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Onboarded in Chennai
          </div>
        </div>

        <div className="foodie-card" style={{ padding: "22px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
            Registered Patrons
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: "800" }}>
            {summary.total_customers}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Verified Accounts
          </div>
        </div>
      </div>

      {/* Grid: Sales Activity & Most Popular Dishes */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "32px",
        marginBottom: "40px"
      }}>
        {/* Sales by Date */}
        <div className="foodie-card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>
            Recent Daily Sales Trends
          </h3>
          {salesChart.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No daily transaction records.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {salesChart.map((s, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)"
                }}>
                  <div>
                    <strong style={{ fontSize: "0.95rem" }}>{s.date}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {s.orders} {s.orders === 1 ? "order" : "orders"}
                    </div>
                  </div>
                  <span style={{ fontWeight: "800", color: "var(--primary-600)", fontSize: "1.05rem" }}>
                    ₹{Number(s.revenue).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Dishes */}
        <div className="foodie-card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>
            Top Sold Signature Dishes
          </h3>
          {popularItems.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No sales data yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {popularItems.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)"
                }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {item.restaurant} • {item.units_sold} units sold
                    </div>
                  </div>
                  <span style={{ fontWeight: "800", color: "var(--text-dark)", fontSize: "0.95rem" }}>
                    ₹{Number(item.revenue).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
