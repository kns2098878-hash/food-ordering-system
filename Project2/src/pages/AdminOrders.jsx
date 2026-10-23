import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { getAdminOrders, updateAdminOrderStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminOrders() {
  const { showToast } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    getAdminOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateAdminOrderStatus(orderId, newStatus, "Status updated by admin console");
      showToast(`Order status updated to ${newStatus}`, "success");
      fetchOrders();
    } catch (err) {
      showToast(err.message || "Failed to update status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <Link to="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "6px" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", fontFamily: "var(--font-serif)" }}>
            Customer Orders Management
          </h1>
        </div>
        <button onClick={fetchOrders} className="btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: "100px", borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="foodie-card" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No customer orders found in the database.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((o) => (
            <div
              key={o.id}
              className="foodie-card"
              style={{
                padding: "20px 24px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                    {o.order_number || `#${o.id}`}
                  </h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    from <strong>{o.restaurant_name}</strong>
                  </span>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "16px", marginBottom: "6px" }}>
                  <span>Customer: <strong>{o.customer_name || `User #${o.user_id}`}</strong> ({o.phone})</span>
                  <span>Amount: <strong style={{ color: "var(--primary-600)" }}>₹{Number(o.total_amount).toFixed(2)}</strong></span>
                  <span>Payment: {o.payment_method}</span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Deliver to: {o.delivery_address_text}
                </div>
              </div>

              {/* Status Select Control */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>Status:</span>
                <select
                  className="form-select"
                  value={o.status}
                  disabled={updatingId === o.id}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "var(--radius-md)", fontSize: "0.85rem" }}
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
