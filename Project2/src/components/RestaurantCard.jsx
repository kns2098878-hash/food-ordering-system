import { Star, Clock, Bike, Leaf, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  if (!restaurant) return null;

  return (
    <div className="foodie-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Image with badges */}
      <div style={{ position: "relative", width: "100%", height: "200px", overflow: "hidden" }}>
        <img 
          src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"} 
          alt={restaurant.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease"
          }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";
          }}
        />
        
        {/* Rating Badge */}
        <div style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          backgroundColor: "#FFFFFF",
          padding: "4px 8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontWeight: "700",
          fontSize: "0.85rem",
          boxShadow: "var(--shadow-md)"
        }}>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <span>{Number(restaurant.rating).toFixed(1)}</span>
        </div>

        {/* Pure Veg Badge */}
        {restaurant.is_pure_veg && (
          <div style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            backgroundColor: "#059669",
            color: "#FFFFFF",
            padding: "4px 8px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: "700",
            fontSize: "0.75rem",
            boxShadow: "var(--shadow-md)"
          }}>
            <Leaf size={12} fill="#FFFFFF" />
            <span>PURE VEG</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700" }}>{restaurant.name}</h3>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>
              {restaurant.price_tier}
            </span>
          </div>

          <p style={{ color: "var(--primary-600)", fontSize: "0.88rem", fontWeight: "600", marginBottom: "8px" }}>
            {restaurant.cuisine_type}
          </p>

          <p style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginBottom: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {restaurant.tagline || restaurant.address}
          </p>
        </div>

        <div>
          {/* Metadata chips */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-warm)",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            marginBottom: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={15} color="var(--primary-500)" />
              <span>{restaurant.estimated_delivery_time}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Bike size={15} color="var(--primary-500)" />
              <span>₹{Number(restaurant.delivery_fee).toFixed(0)} fee</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Link 
              to={`/restaurants/${restaurant.id}/menu`} 
              className="btn-primary btn-sm"
              style={{ width: "100%" }}
            >
              Order Online
            </Link>
            <Link 
              to={`/reservation?restaurant_id=${restaurant.id}`} 
              className="btn-secondary btn-sm"
              style={{ width: "100%", gap: "4px" }}
            >
              <CalendarDays size={14} color="var(--primary-600)" />
              <span>Book Table</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
