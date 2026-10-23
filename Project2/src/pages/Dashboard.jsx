import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  CalendarDays, 
  User, 
  MapPin, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  CreditCard
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getOrders, getReservations, getAddresses } from "../services/api";

function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOrders(user?.id).catch(() => []),
      getReservations(user?.id).catch(() => []),
      getAddresses().catch(() => [])
    ])
      .then(([ordData, resData, addrData]) => {
        setOrders(ordData);
        setReservations(resData);
        setAddresses(addrData);
        setLoading(false);
      });
  }, [user]);

  const activeReservations = reservations.filter((r) => ["pending", "confirmed"].includes(r.status));
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="page-wrapper container" style={{ maxWidth: "1000px" }}>
      {/* Welcome Header */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "36px"
      }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: "8px" }}>Customer Portal</span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-serif)" }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Here is your account overview, recent order history, and active reservations.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {isAdmin && (
            <Link to="/admin" className="btn-secondary btn-sm" style={{ borderColor: "var(--primary-600)", color: "var(--primary-700)" }}>
              Admin Panel
            </Link>
          )}
          <Link to="/restaurants" className="btn-primary btn-sm">
            Order Food Now
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        <div className="foodie-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "var(--primary-100)",
              color: "var(--primary-600)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ShoppingBag size={20} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>Total Orders</span>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: "800" }}>{orders.length}</div>
        </div>

        <div className="foodie-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#DEF7EC",
              color: "#03543F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <CalendarDays size={20} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>Active Bookings</span>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: "800" }}>{activeReservations.length}</div>
        </div>

        <div className="foodie-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <MapPin size={20} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>Saved Addresses</span>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: "800" }}>{addresses.length}</div>
        </div>

        <div className="foodie-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#FEF08A",
              color: "#854D0E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Sparkles size={20} />
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>Foodie Tier</span>
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "#854D0E" }}>
            {orders.length >= 3 ? "Gold Member" : "Silver Member"}
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "32px",
        alignItems: "flex-start"
      }}>
        {/* Recent Orders Section */}
        <div className="foodie-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Recent Orders</h3>
            <Link to="/orders" style={{ fontSize: "0.85rem", color: "var(--primary-600)", fontWeight: "700" }}>
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No orders placed yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {recentOrders.map((o) => (
                <div key={o.id} style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{o.restaurant_name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {o.order_number || `#${o.id}`} • ₹{Number(o.total_amount).toFixed(0)}
                    </div>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Dining Reservations */}
        <div className="foodie-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Upcoming Reservations</h3>
            <Link to="/reservations" style={{ fontSize: "0.85rem", color: "var(--primary-600)", fontWeight: "700" }}>
              View All
            </Link>
          </div>

          {activeReservations.length === 0 ? (
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "16px" }}>
                You have no active table reservations at this moment.
              </p>
              <Link to="/reservation" className="btn-secondary btn-sm">
                Book a Table
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {activeReservations.map((r) => (
                <div key={r.id} style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{r.restaurant_name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {r.date || r.reservation_date} at {r.time || r.reservation_time} • {r.guests || r.party_size} Guests
                    </div>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>
                    {r.table_name || `Table ${r.table_number || "Reserved"}`}
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

export default Dashboard;
