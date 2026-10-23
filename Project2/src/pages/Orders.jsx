import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Receipt, 
  Clock, 
  MapPin, 
  ChevronRight, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Bike,
  Utensils,
  Navigation,
  PhoneCall,
  Sparkles
} from "lucide-react";
import { getOrders, getOrderDetail, cancelOrder, trackOrder } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { user, showToast } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = () => {
    setLoading(true);
    getOrders(user?.id)
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setLoading(false);
      });
  };

  const handleOpenDetail = async (orderId) => {
    try {
      const detail = await getOrderDetail(orderId);
      setSelectedOrder(detail);
    } catch {
      showToast("Failed to load order details.", "error");
    }
  };

  const handleOpenTracking = async (e, orderId) => {
    e.stopPropagation();
    try {
      setTrackingLoading(true);
      const data = await trackOrder(orderId);
      setTrackingData(data);
    } catch (err) {
      showToast(err.message || "Failed to load live tracking", "error");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      setCancelling(true);
      await cancelOrder(orderId, "Cancelled by user through order portal");
      showToast("Order has been cancelled.", "info");
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      showToast(err.message || "Failed to cancel order.", "error");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <span className="badge badge-success">Delivered</span>;
      case "out_for_delivery":
        return <span className="badge badge-warning" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><Bike size={14} /> Out for Delivery</span>;
      case "preparing":
        return <span className="badge badge-primary">In Kitchen</span>;
      case "confirmed":
        return <span className="badge badge-primary">Confirmed</span>;
      case "cancelled":
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-warning">Placed</span>;
    }
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "860px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "4px" }}>
            My Orders
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Track and review your past and active culinary deliveries.
          </p>
        </div>
        <Link to="/restaurants" className="btn-primary btn-sm">
          Order New Meal
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div className="spinner" style={{ margin: "auto" }}></div>
          <p style={{ color: "var(--text-muted)", marginTop: "16px" }}>Fetching your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="foodie-card" style={{ padding: "48px", textAlign: "center" }}>
          <Receipt size={48} color="var(--primary-400)" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "8px" }}>No orders placed yet</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Satisfy your hunger with delicious cuisines from our hand-picked restaurants.
          </p>
          <Link to="/restaurants" className="btn-primary">
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="foodie-card"
              style={{
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "var(--transition-fast)"
              }}
              onClick={() => handleOpenDetail(order.id)}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "800", fontSize: "1.05rem", color: "var(--text-dark)" }}>
                    {order.restaurant_name || `Restaurant #${order.restaurant_id}`}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "16px" }}>
                  <span>Order: <strong>{order.order_number}</strong></span>
                  <span>Date: {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}</span>
                  <span style={{ color: "var(--primary-600)", fontWeight: "700" }}>
                    ₹{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {["placed", "confirmed", "preparing", "out_for_delivery"].includes(order.status) && (
                  <button
                    onClick={(e) => handleOpenTracking(e, order.id)}
                    className="btn-primary btn-sm"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      fontSize: "0.85rem",
                      borderRadius: "20px"
                    }}
                  >
                    <Navigation size={14} />
                    <span>Live Track</span>
                  </button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary-600)", fontWeight: "600", fontSize: "0.9rem" }}>
                  <span>Receipt</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIVE TRACKING MODAL */}
      {trackingData && (
        <div className="modal-overlay" onClick={() => setTrackingData(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "32px", maxWidth: "560px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Navigation className="text-primary" size={22} />
                  Live Order Tracker
                </h2>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Order #{trackingData.order_number}
                </span>
              </div>
              <button
                onClick={() => setTrackingData(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Estimated Time Card */}
            <div style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
              color: "#FFFFFF",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 }}>
                  Estimated Arrival
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "800" }}>
                  {trackingData.estimated_minutes > 0 ? `${trackingData.estimated_minutes} mins` : "Delivered"}
                </div>
              </div>
              <Bike size={38} color="#FFFFFF" />
            </div>

            {/* Rider Info Card */}
            <div style={{
              background: "var(--bg-surface)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{trackingData.delivery_partner.name}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{trackingData.delivery_partner.vehicle}</div>
              </div>
              <a
                href={`tel:${trackingData.delivery_partner.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  backgroundColor: "var(--primary-50)",
                  color: "var(--primary-700)",
                  fontWeight: "600",
                  fontSize: "0.82rem",
                  textDecoration: "none"
                }}
              >
                <PhoneCall size={14} />
                <span>Call Rider</span>
              </a>
            </div>

            {/* Simulated Live Route Map View */}
            <div style={{
              height: "140px",
              borderRadius: "12px",
              background: "#E2E8F0",
              marginBottom: "1.5rem",
              position: "relative",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{ position: "absolute", top: "20px", left: "20px", display: "flex", alignItems: "center", gap: "6px", background: "white", padding: "4px 8px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700" }}>
                <Utensils size={14} color="#EA580C" /> Restaurant
              </div>
              <div style={{ position: "absolute", bottom: "20px", right: "20px", display: "flex", alignItems: "center", gap: "6px", background: "white", padding: "4px 8px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700" }}>
                <MapPin size={14} color="#16A34A" /> Your Doorstep
              </div>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#EA580C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 0 0 8px rgba(234, 88, 12, 0.2)",
                animation: "pulse 2s infinite"
              }}>
                <Bike size={22} />
              </div>
            </div>

            {/* Progress Timeline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {trackingData.timeline.map((step, idx) => (
                <div key={step.key} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: step.completed ? "var(--primary-600)" : "#CBD5E1",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    flexShrink: 0
                  }}>
                    {step.completed ? "✓" : idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: step.completed ? "700" : "500", fontSize: "0.95rem", color: step.completed ? "var(--text-dark)" : "var(--text-muted)" }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "4px" }}>
                  Order Details
                </h2>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {selectedOrder.order_number}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              marginBottom: "20px"
            }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Status</div>
                <div style={{ fontWeight: "700" }}>{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Placed On</div>
                <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>
                  {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : ""}
                </div>
              </div>
            </div>

            {/* Purchased Items */}
            <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "12px" }}>Items Purchased</h4>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--border-warm)"
            }}>
              {selectedOrder.items && selectedOrder.items.map((it) => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.92rem" }}>
                  <div>
                    <span style={{ fontWeight: "700" }}>{it.quantity}x</span> {it.item_name}
                    {it.customization_notes && (
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block" }}>
                        Note: {it.customization_notes}
                      </span>
                    )}
                  </div>
                  <span style={{ fontWeight: "700" }}>₹{Number(it.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9rem", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                <span>₹{Number(selectedOrder.subtotal).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Delivery Fee</span>
                <span>₹{Number(selectedOrder.delivery_fee).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Taxes (5%)</span>
                <span>₹{Number(selectedOrder.tax_amount).toFixed(2)}</span>
              </div>
              {Number(selectedOrder.discount_amount) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--success)", fontWeight: "700" }}>
                  <span>Discount ({selectedOrder.coupon_code})</span>
                  <span>-₹{Number(selectedOrder.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "10px",
                borderTop: "1px solid var(--border-warm)",
                fontWeight: "800",
                fontSize: "1.15rem"
              }}>
                <span>Total Amount Paid</span>
                <span style={{ color: "var(--primary-600)" }}>₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Destination */}
            {selectedOrder.delivery_address_text && (
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
                <strong>Delivery Address:</strong> {selectedOrder.delivery_address_text}
              </div>
            )}

            {/* Cancellation Option if placed or confirmed */}
            {["placed", "confirmed"].includes(selectedOrder.status) && (
              <button
                onClick={() => handleCancelOrder(selectedOrder.id)}
                className="btn-secondary"
                disabled={cancelling}
                style={{ width: "100%", color: "var(--danger)", borderColor: "var(--danger)" }}
              >
                {cancelling ? "Processing..." : "Cancel This Order"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
