import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, MapPin, Receipt, ArrowRight, UtensilsCrossed } from "lucide-react";
import { getOrderDetail } from "../services/api";

function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const orderId = localStorage.getItem("lastOrderId");

  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId)
        .then((data) => setOrder(data))
        .catch(() => {
          try {
            const fallback = localStorage.getItem("lastOrderData");
            if (fallback) setOrder(JSON.parse(fallback));
          } catch {}
        });
    }
  }, [orderId]);

  return (
    <div className="page-wrapper container" style={{ maxWidth: "700px" }}>
      <div className="foodie-card" style={{ padding: "48px 32px", textAlign: "center" }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#DEF7EC",
          color: "#03543F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px auto"
        }}>
          <CheckCircle2 size={48} />
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>
          Order Confirmed!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "32px" }}>
          Your order has been safely placed and dispatched to the kitchen.
        </p>

        {order && (
          <div style={{
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            textAlign: "left",
            marginBottom: "32px",
            border: "1px solid var(--border-warm)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Order Reference</div>
                <strong style={{ fontSize: "1.05rem" }}>{order.order_number || `#${order.id}`}</strong>
              </div>
              <span className="badge badge-success">
                {order.status}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.9rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Restaurant:</span>
                <div style={{ fontWeight: "700" }}>{order.restaurant_name}</div>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Total Paid:</span>
                <div style={{ fontWeight: "800", color: "var(--primary-600)" }}>₹{Number(order.total_amount).toFixed(2)}</div>
              </div>
            </div>

            {order.delivery_address_text && (
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-warm)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                  <MapPin size={16} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{order.delivery_address_text}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Link to="/orders" className="btn-primary">
            <Receipt size={18} /> View All Orders
          </Link>
          <Link to="/restaurants" className="btn-secondary">
            Explore More Dishes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
