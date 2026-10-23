import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

function FoodModal({ item, restaurant, onClose }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [notes, setNotes] = useState("");

  if (!item) return null;

  const basePrice = Number(item.discount_price ?? item.price);
  const optionsExtra = selectedOptions.reduce((sum, opt) => sum + Number(opt.price_adjustment), 0);
  const unitPrice = basePrice + optionsExtra;
  const totalPrice = unitPrice * qty;

  const handleOptionToggle = (opt) => {
    setSelectedOptions((prev) => {
      const exists = prev.find((o) => o.id === opt.id);
      if (exists) {
        return prev.filter((o) => o.id !== opt.id);
      }
      return [...prev, opt];
    });
  };

  const handleAddToCart = () => {
    const customizedItem = {
      ...item,
      price: unitPrice,
      selectedOptions,
    };
    const combinedNotes = [
      selectedOptions.map((o) => o.name).join(", "),
      notes.trim()
    ].filter(Boolean).join(" | ");

    addToCart(customizedItem, qty, restaurant, combinedNotes);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header Image */}
        <div style={{ position: "relative", height: "220px" }}>
          <img 
            src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"} 
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button 
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "700" }}>{item.name}</h3>
            <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--primary-600)" }}>
              ₹{basePrice.toFixed(0)}
            </span>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
            {item.description}
          </p>

          {/* Options / Customizations */}
          {item.options && item.options.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px", color: "var(--text-dark)" }}>
                Customizations & Add-ons
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {item.options.map((opt) => {
                  const isChecked = selectedOptions.some((o) => o.id === opt.id);
                  return (
                    <label 
                      key={opt.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: isChecked ? "var(--primary-50)" : "var(--bg-surface)",
                        border: isChecked ? "1.5px solid var(--primary-500)" : "1.5px solid var(--border-warm)",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleOptionToggle(opt)}
                          style={{ accentColor: "var(--primary-600)", width: "16px", height: "16px" }}
                        />
                        <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{opt.name}</span>
                      </div>
                      <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--primary-600)" }}>
                        {Number(opt.price_adjustment) > 0 ? `+₹${Number(opt.price_adjustment).toFixed(0)}` : "Free"}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div style={{ marginBottom: "24px" }}>
            <label className="form-label">Special Cooking Instructions</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Less spicy, dressing on the side..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Footer controls: Quantity + Total Button */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-warm)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              backgroundColor: "var(--bg-surface)",
              padding: "8px 14px",
              borderRadius: "var(--radius-md)"
            }}>
              <button 
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <Minus size={18} />
              </button>
              <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>{qty}</span>
              <button 
                onClick={() => setQty((q) => q + 1)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <Plus size={18} />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ flex: 1, marginLeft: "20px" }}
            >
              Add to Cart • ₹{totalPrice.toFixed(0)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodModal;
