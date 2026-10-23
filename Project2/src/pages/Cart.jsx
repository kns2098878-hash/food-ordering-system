import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  X,
  Bike
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const { 
    cart, 
    restaurant, 
    coupon, 
    subtotal, 
    deliveryFee, 
    tax, 
    discountAmount, 
    total, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const { showToast } = useAuth();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setPromoLoading(true);
    const result = await applyPromoCode(promoInput.trim());
    setPromoLoading(false);

    if (result.success) {
      showToast(result.message, "success");
      setPromoInput("");
    } else {
      showToast(result.message, "error");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-wrapper container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          backgroundColor: "var(--primary-100)",
          color: "var(--primary-600)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px auto"
        }}>
          <ShoppingBag size={44} />
        </div>
        <h2 style={{ fontSize: "1.85rem", fontWeight: "800", marginBottom: "12px", fontFamily: "var(--font-serif)" }}>
          Your Feast Basket is Empty
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "460px", margin: "0 auto 32px auto" }}>
          You haven't added any culinary treats yet. Explore our top restaurants and satisfy your cravings today!
        </p>
        <Link to="/restaurants" className="btn-primary" style={{ padding: "14px 32px" }}>
          Explore Menus Now
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "4px" }}>
              My Food Cart
            </h1>
            {restaurant && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Ordering from <strong style={{ color: "var(--primary-600)" }}>{restaurant.name}</strong>
              </p>
            )}
          </div>

          <button 
            onClick={clearCart}
            style={{
              background: "none",
              border: "none",
              color: "var(--danger)",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "40px",
          alignItems: "flex-start"
        }}>
          {/* LEFT: Cart Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="foodie-card"
                style={{
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                  <img 
                    src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"} 
                    alt={item.name}
                    style={{ width: "70px", height: "70px", borderRadius: "var(--radius-md)", objectFit: "cover" }}
                  />
                  <div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "4px" }}>
                      {item.name}
                    </h4>
                    <div style={{ color: "var(--primary-600)", fontWeight: "700", fontSize: "0.95rem" }}>
                      ₹{Number(item.price).toFixed(0)}
                    </div>
                    {item.notes && (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        <em>Note: {item.notes}</em>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "var(--bg-surface)",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-warm)"
                  }}>
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dark)" }}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ fontWeight: "700", minWidth: "16px", textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dark)" }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span style={{ fontWeight: "800", fontSize: "1.05rem", minWidth: "60px", textAlign: "right" }}>
                    ₹{(Number(item.price) * item.quantity).toFixed(0)}
                  </span>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-light)" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary & Coupon */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Promo Code Box */}
            <div className="foodie-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Tag size={20} color="var(--primary-600)" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Apply Promo Code</h3>
              </div>

              {coupon ? (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--primary-50)",
                  border: "1px solid var(--primary-200)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={20} color="var(--success)" />
                    <div>
                      <strong style={{ color: "var(--primary-700)", fontSize: "0.95rem" }}>{coupon.code}</strong>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Savings of ₹{coupon.discount_amount} applied!
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={removePromoCode}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "10px" }}>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Enter code (e.g. FOODIE50)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  />
                  <button 
                    type="submit" 
                    className="btn-secondary"
                    disabled={promoLoading || !promoInput.trim()}
                  >
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </form>
              )}
            </div>

            {/* Price Breakdown Bill */}
            <div className="foodie-card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px" }}>
                Bill Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.95rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Items Subtotal</span>
                  <span style={{ fontWeight: "600" }}>₹{subtotal.toFixed(2)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Restaurant Delivery Fee</span>
                  <span style={{ fontWeight: "600" }}>₹{deliveryFee.toFixed(2)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Taxes & GST (5%)</span>
                  <span style={{ fontWeight: "600" }}>₹{tax.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--success)" }}>
                    <span>Promo Discount ({coupon?.code})</span>
                    <span style={{ fontWeight: "700" }}>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  marginTop: "8px",
                  borderTop: "2px solid var(--border-warm)",
                  fontSize: "1.25rem",
                  fontWeight: "800"
                }}>
                  <span>To Pay</span>
                  <span style={{ color: "var(--primary-600)" }}>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate("/checkout")}
                className="btn-primary"
                style={{ width: "100%", marginTop: "24px", padding: "14px", fontSize: "1.05rem" }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
