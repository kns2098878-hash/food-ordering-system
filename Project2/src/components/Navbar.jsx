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

          <a
            href="https://github.com/kns2098878-hash/food-ordering-system/tree/main/Project2"
            target="_blank"
            rel="noopener noreferrer"
            title="View Project2 on GitHub"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "20px",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-dark)",
              border: "1px solid var(--border-warm)",
              fontWeight: "600",
              fontSize: "0.85rem",
              textDecoration: "none"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </a>

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
