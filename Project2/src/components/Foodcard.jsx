import { useState } from "react";
import { Plus, Minus, Flame, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";

function FoodCard({ item, restaurant = null, onSelectCustomization = null }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find((i) => i.id === item.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (item.options && item.options.length > 0 && onSelectCustomization) {
      onSelectCustomization(item);
    } else {
      addToCart(item, 1, restaurant);
    }
  };

  return (
    <div className="foodie-card" style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      position: "relative"
    }}>
      <div>
        {/* Item Image */}
        <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
          <img 
            src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"} 
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800";
            }}
          />

          {/* Veg / Non-Veg Indicator */}
          <div style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: "#FFFFFF",
            padding: "4px",
            borderRadius: "6px",
            boxShadow: "var(--shadow-sm)"
          }}>
            <div style={{
              width: "16px",
              height: "16px",
              border: item.is_vegetarian ? "2px solid #059669" : "2px solid #DC2626",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: item.is_vegetarian ? "#059669" : "#DC2626"
              }} />
            </div>
          </div>

          {/* Badges */}
          <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "6px" }}>
            {item.is_popular && (
              <span className="badge badge-warning" style={{ boxShadow: "var(--shadow-sm)" }}>
                <Sparkles size={11} /> Popular
              </span>
            )}
            {item.is_spicy && (
              <span className="badge badge-danger" style={{ boxShadow: "var(--shadow-sm)" }}>
                <Flame size={11} /> Spicy
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "16px" }}>
          <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "6px" }}>{item.name}</h4>
          <p style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginBottom: "12px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {item.description}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div style={{
        padding: "0 16px 16px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          {item.discount_price ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--primary-600)" }}>
                ₹{Number(item.discount_price).toFixed(0)}
              </span>
              <span style={{ fontSize: "0.85rem", textDecoration: "line-through", color: "var(--text-light)" }}>
                ₹{Number(item.price).toFixed(0)}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-dark)" }}>
              ₹{Number(item.price).toFixed(0)}
            </span>
          )}
        </div>

        {qty > 0 ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "var(--primary-50)",
            padding: "4px 8px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--primary-200)"
          }}>
            <button 
              onClick={() => updateQuantity(item.id, -1)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-700)" }}
            >
              <Minus size={16} />
            </button>
            <span style={{ fontWeight: "700", color: "var(--primary-700)", minWidth: "16px", textAlign: "center" }}>
              {qty}
            </span>
            <button 
              onClick={() => updateQuantity(item.id, 1)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-700)" }}
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleAdd}
            className="btn-primary btn-sm"
            style={{ borderRadius: "var(--radius-md)", padding: "6px 16px" }}
          >
            <Plus size={16} /> Add
          </button>
        )}
      </div>
    </div>
  );
}

export default FoodCard;
