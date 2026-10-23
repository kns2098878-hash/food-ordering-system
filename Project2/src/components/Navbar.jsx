import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  CalendarDays, 
  User, 
  Search, 
  LogOut, 
  LayoutDashboard, 
  ShieldAlert, 
  Menu as MenuIcon, 
  X,
  Compass,
  Wallet as WalletIcon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header style={{
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid var(--border-warm)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "var(--shadow-sm)"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "72px"
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            boxShadow: "var(--shadow-orange)"
          }}>
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <span style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              letterSpacing: "-0.03em",
              color: "var(--text-dark)",
              fontFamily: "var(--font-serif)"
            }}>
              Food<span style={{ color: "var(--primary-600)" }}>ie.</span>
            </span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} style={{
          display: "flex",
          alignItems: "center",
          background: "var(--bg-surface)",
          borderRadius: "9999px",
          padding: "6px 16px",
          width: "300px",
          border: "1px solid var(--border-warm)"
        }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: "8px" }} />
          <input 
            type="text"
            placeholder="Search restaurants, dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "0.9rem",
              width: "100%",
              color: "var(--text-dark)"
            }}
          />
        </form>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link to="/restaurants" style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "600",
            fontSize: "0.92rem",
            color: "var(--text-dark)"
          }}>
            <Compass size={18} color="var(--primary-600)" />
            <span>Explore</span>
          </Link>

          <Link to="/reservation" style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "600",
            fontSize: "0.92rem",
            color: "var(--text-dark)"
          }}>
            <CalendarDays size={18} color="var(--primary-600)" />
            <span>Book Table</span>
          </Link>

          {isAuthenticated && (
            <Link to="/wallet" style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "600",
              fontSize: "0.92rem",
              color: "var(--primary-700)",
              backgroundColor: "var(--primary-50)",
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid var(--primary-200)"
            }}>
              <WalletIcon size={16} />
              <span>Wallet</span>
            </Link>
          )}

          {/* Cart Icon with badge */}
          <Link to="/cart" style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-dark)"
          }}>
            <ShoppingBag size={20} />
            {totalItemsCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "var(--primary-600)",
                color: "#FFFFFF",
                fontSize: "0.75rem",
                fontWeight: "700",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 5px rgba(234, 88, 12, 0.4)"
              }}>
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* User Status / Account Dropdown */}
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/dashboard" style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-dark)",
                border: "1px solid var(--border-warm)",
                fontWeight: "600",
                fontSize: "0.88rem"
              }}>
                <User size={16} />
                <span>{user.name.split(" ")[0]}</span>
              </Link>

              {isAdmin && (
                <Link to="/admin" className="btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldAlert size={16} color="var(--primary-600)" />
                  <span>Admin</span>
                </Link>
              )}

              <button 
                onClick={logout}
                title="Sign out"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "6px"
                }}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/login" className="btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
