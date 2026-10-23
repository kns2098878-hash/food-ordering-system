import { Link } from "react-router-dom";
import { UtensilsCrossed, Compass, ArrowRight } from "lucide-react";

function NotFound() {
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
        <UtensilsCrossed size={44} />
      </div>

      <h1 style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-serif)", color: "var(--primary-600)", marginBottom: "8px" }}>
        404
      </h1>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "12px" }}>
        Recipe Not Found!
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto 32px auto" }}>
        The culinary page you are searching for might have been moved, removed, or never existed in our kitchen menu.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        <Link to="/" className="btn-primary">
          Back to Home Page
        </Link>
        <Link to="/restaurants" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Compass size={18} /> Explore Restaurants
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
