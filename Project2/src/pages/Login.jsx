import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="page-wrapper container" style={{ maxWidth: "480px" }}>
      <div className="foodie-card" style={{ padding: "40px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Sign in to track orders, manage reservations & redeem coupons.
          </p>
        </div>

        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            borderRadius: "var(--radius-md)",
            marginBottom: "20px",
            fontSize: "0.9rem"
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "14px", marginTop: "8px" }}
          >
            {loading ? "Authenticating..." : "Sign In to Foodie"}
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div style={{
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid var(--border-warm)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "10px", fontWeight: "600" }}>
            Quick Demo Autofill:
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleAutofill("riharika@gmail.com", "123456")}
              style={{
                fontSize: "0.8rem",
                padding: "6px 12px",
                borderRadius: "9999px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-warm)",
                cursor: "pointer"
              }}
            >
              Customer (Riharika)
            </button>
            <button
              type="button"
              onClick={() => handleAutofill("sriram@gmail.com", "sriram123")}
              style={{
                fontSize: "0.8rem",
                padding: "6px 12px",
                borderRadius: "9999px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-warm)",
                cursor: "pointer"
              }}
            >
              Customer (Sriram)
            </button>
            <button
              type="button"
              onClick={() => handleAutofill("admin@foodie.com", "admin123")}
              style={{
                fontSize: "0.8rem",
                padding: "6px 12px",
                borderRadius: "9999px",
                backgroundColor: "var(--primary-100)",
                border: "1px solid var(--primary-200)",
                color: "var(--primary-700)",
                cursor: "pointer",
                fontWeight: "700"
              }}
            >
              Admin Demo
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "var(--primary-600)", fontWeight: "700" }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
