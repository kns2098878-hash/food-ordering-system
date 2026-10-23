import { UtensilsCrossed, Heart, ShieldCheck, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{
      backgroundColor: "#1E293B",
      color: "#F8FAFC",
      paddingTop: "60px",
      paddingBottom: "30px",
      marginTop: "auto"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          marginBottom: "48px"
        }}>
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "var(--primary-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF"
              }}>
                <UtensilsCrossed size={20} />
              </div>
              <span style={{ fontSize: "1.4rem", fontWeight: "800", fontFamily: "var(--font-serif)" }}>
                Food<span style={{ color: "var(--primary-500)" }}>ie.</span>
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "16px" }}>
              Foodie is an advanced academic food ordering and table reservation platform engineered for culinary discovery, instant reservations, and lightning-fast delivery.
            </p>
            <div style={{ display: "flex", gap: "8px", color: "var(--primary-500)", fontSize: "0.85rem" }}>
              <ShieldCheck size={18} />
              <span>ACID Safe Relational Platform</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "18px", color: "#FFFFFF" }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "#94A3B8" }}>
              <li><Link to="/restaurants" style={{ transition: "color 0.2s" }}>Explore Restaurants</Link></li>
              <li><Link to="/reservation">Book a Table</Link></li>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/dashboard">Customer Portal</Link></li>
            </ul>
          </div>

          {/* Col 3: Cuisines */}
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "18px", color: "#FFFFFF" }}>
              Featured Cuisines
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "#94A3B8" }}>
              <li><Link to="/restaurants?cuisine=Biryani">Awadhi & Dum Biryani</Link></li>
              <li><Link to="/restaurants?cuisine=South Indian">Traditional South Indian</Link></li>
              <li><Link to="/restaurants?cuisine=Italian">Artisanal Italian Pizza</Link></li>
              <li><Link to="/restaurants?cuisine=Pan-Asian">Cantonese Dim Sum</Link></li>
              <li><Link to="/restaurants?pure_veg=true">Organic & Farm Bowls</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Operations */}
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "18px", color: "#FFFFFF" }}>
              Demo Headquarters
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem", color: "#94A3B8" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <MapPin size={18} color="var(--primary-500)" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span>Pondy Bazaar, T. Nagar, Chennai, Tamil Nadu 600017</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Phone size={18} color="var(--primary-500)" style={{ flexShrink: 0 }} />
                <span>+91 44 2800 1234</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Mail size={18} color="var(--primary-500)" style={{ flexShrink: 0 }} />
                <span>support@foodieplatform.local</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid #334155",
          paddingTop: "24px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          fontSize: "0.85rem",
          color: "#64748B"
        }}>
          <div>
            &copy; 2026 Foodie System. Designed & Developed for Full-Stack Academic Demonstration.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Crafted with</span>
            <Heart size={14} color="#EF4444" fill="#EF4444" />
            <span>using React, Flask & MySQL 8.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
