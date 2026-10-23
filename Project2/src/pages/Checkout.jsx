import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  CheckCircle2,
  AlertCircle,
  Wallet as WalletIcon
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder, getAddresses, createAddress, getWallet } from "../services/api";

function Checkout() {
  const { cart, restaurant, coupon, subtotal, deliveryFee, tax, discountAmount, total, clearCart } = useCart();
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [customAddress, setCustomAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [walletBalance, setWalletBalance] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }

    getAddresses()
      .then((addrs) => {
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setCustomAddress(`${defaultAddr.address_line1}, ${defaultAddr.city} - ${defaultAddr.postal_code}`);
          if (defaultAddr.phone) setPhone(defaultAddr.phone);
        }
      })
      .catch(() => {});

    getWallet()
      .then((res) => {
        if (res?.wallet?.balance !== undefined) {
          setWalletBalance(res.wallet.balance);
        }
      })
      .catch(() => {});
  }, [cart, navigate]);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setCustomAddress(`${addr.address_line1}, ${addr.city} - ${addr.postal_code}`);
    if (addr.phone) setPhone(addr.phone);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    const cleanAddress = customAddress.trim();
    const cleanPhone = phone.trim();

    if (!cleanAddress || cleanAddress.length < 8) {
      setError("Please provide a complete delivery address (minimum 8 characters).");
      return;
    }

    if (!/^\+?[0-9\s-]{10,15}$/.test(cleanPhone)) {
      setError("Please provide a valid phone number (10 digits).");
      return;
    }

    if (paymentMethod === "wallet" && walletBalance !== null && walletBalance < total) {
      setError(`Insufficient wallet balance (Available: ₹${walletBalance.toFixed(2)}, Order Total: ₹${total.toFixed(2)}). Please top up your wallet or choose another payment method.`);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        user_id: user?.id,
        restaurant_id: restaurant?.id || (cart[0]?.restaurant_id),
        items: cart.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          customization_notes: i.notes || ""
        })),
        address: cleanAddress,
        phone: cleanPhone,
        payment_method: paymentMethod,
        coupon_code: coupon ? coupon.code : null,
        notes: notes.trim()
      };

      const res = await placeOrder(payload);

      localStorage.setItem("lastOrderId", res.order_id);
      localStorage.setItem("lastOrderData", JSON.stringify(res.order || res));

      clearCart();
      showToast("Order placed successfully!", "success");
      navigate("/order-confirmation");
    } catch (err) {
      setError(err.message || "Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg-warm)", minHeight: "calc(100vh - 72px)", padding: "40px 0" }}>
      <div className="container" style={{ maxWidth: "1080px" }}>
        
        {/* Page Title */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-dark)", fontFamily: "var(--font-serif)" }}>
            Complete Your Order
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Ordering from <strong style={{ color: "var(--text-dark)" }}>{restaurant?.name || "Selected Restaurant"}</strong>
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FCA5A5",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            color: "#991B1B",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.92rem"
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px", alignItems: "start" }}>
            
            {/* Left Column: Form Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* 1. Delivery Address */}
              <div className="foodie-card" style={{ padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <MapPin size={22} color="var(--primary-600)" />
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Delivery Location</h3>
                </div>

                {savedAddresses.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <label className="form-label">Choose Saved Address</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            style={{
                              padding: "14px",
                              borderRadius: "var(--radius-md)",
                              border: isSelected ? "2px solid var(--primary-600)" : "1px solid var(--border-warm)",
                              backgroundColor: isSelected ? "var(--primary-50)" : "#FFFFFF",
                              cursor: "pointer",
                              transition: "var(--transition-fast)"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ fontWeight: "700", fontSize: "0.88rem", textTransform: "capitalize" }}>
                                {addr.address_line2 || "Home"}
                              </span>
                              {isSelected && <CheckCircle2 size={16} color="var(--primary-600)" />}
                            </div>
                            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                              {addr.address_line1}, {addr.city} - {addr.postal_code}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: "16px" }}>
                  <label className="form-label">Full Delivery Address *</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Apartment / Flat number, Street address, Area, Landmark..."
                    value={customAddress}
                    onChange={(e) => {
                      setCustomAddress(e.target.value);
                      setSelectedAddressId(null);
                    }}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "0" }}>
                  <label className="form-label">Contact Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. 9884019283"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 2. Payment Method */}
              <div className="foodie-card" style={{ padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <ShieldCheck size={22} color="var(--primary-600)" />
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Payment Method</h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { 
                      id: "wallet", 
                      name: "Foodie Digital Wallet", 
                      desc: walletBalance !== null ? `Available Balance: ₹${walletBalance.toFixed(2)} (Instant 1-Click Payment)` : "Instant 1-Click Payment via Internal Wallet", 
                      icon: <WalletIcon size={20} color="var(--primary-600)" /> 
                    },
                    { 
                      id: "demo_upi", 
                      name: "Instant Demo UPI", 
                      desc: "Fast approval simulated via PhonePe / GPay / Paytm", 
                      icon: <QrCode size={20} color="var(--primary-600)" /> 
                    },
                    { 
                      id: "demo_card", 
                      name: "Demo Credit / Debit Card", 
                      desc: "Simulated sandbox card payment with instant authorization", 
                      icon: <CreditCard size={20} color="var(--primary-600)" /> 
                    },
                    { 
                      id: "cash_on_delivery", 
                      name: "Cash on Delivery", 
                      desc: "Pay in cash when food is delivered to your door", 
                      icon: <Banknote size={20} color="var(--primary-600)" /> 
                    },
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px 20px",
                          borderRadius: "var(--radius-md)",
                          border: isSelected ? "2px solid var(--primary-600)" : "1px solid var(--border-warm)",
                          backgroundColor: isSelected ? "var(--primary-50)" : "#FFFFFF",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={isSelected}
                            onChange={() => setPaymentMethod(method.id)}
                            style={{ accentColor: "var(--primary-600)", width: "18px", height: "18px" }}
                          />
                          <div>
                            <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{method.name}</div>
                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{method.desc}</div>
                          </div>
                        </div>
                        <div>{method.icon}</div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Delivery Notes */}
              <div className="foodie-card" style={{ padding: "24px" }}>
                <label className="form-label">Drop-off Instructions (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Leave with security, do not ring doorbell..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

            </div>

            {/* Right Column: Order Summary Bill */}
            <div style={{ position: "sticky", top: "96px" }}>
              <div className="foodie-card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", marginBottom: "18px", borderBottom: "1px solid var(--border-warm)", paddingBottom: "12px" }}>
                  Order Summary
                </h3>

                {/* Items preview list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", maxHeight: "200px", overflowY: "auto" }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                      <span style={{ color: "var(--text-dark)", display: "flex", gap: "8px" }}>
                        <span style={{ fontWeight: "700", color: "var(--primary-600)" }}>{item.quantity}×</span>
                        <span>{item.name}</span>
                      </span>
                      <span style={{ fontWeight: "600" }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--border-warm)", paddingTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <span>Item Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <span>GST & Restaurant Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--success)", fontWeight: "600", fontSize: "0.9rem" }}>
                      <span>Discount ({coupon?.code})</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.2rem",
                    fontWeight: "800",
                    color: "var(--text-dark)",
                    borderTop: "2px dashed var(--border-warm)",
                    paddingTop: "16px",
                    marginTop: "6px"
                  }}>
                    <span>Grand Total</span>
                    <span style={{ color: "var(--primary-600)" }}>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    marginTop: "24px",
                    padding: "16px",
                    fontSize: "1.05rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Pay ₹{total.toFixed(2)}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "14px", margin: "14px 0 0" }}>
                  🔒 Secure ACID-compliant transaction protected by Foodie engine
                </p>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}

export default Checkout;
