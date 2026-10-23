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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a
              href="https://github.com/kns2098878-hash/food-ordering-system/tree/main/Project2"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "20px",
                backgroundColor: "#0F172A",
                color: "#38BDF8",
                border: "1px solid #334155",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.82rem"
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>View Project2 on GitHub</span>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Crafted with</span>
              <Heart size={14} color="#EF4444" fill="#EF4444" />
              <span>using React, Flask & MySQL 8.4</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
