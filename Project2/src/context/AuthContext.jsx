import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getAuthToken, loginCustomer, registerCustomer, logoutUser, updateProfile } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Rehydrate user from localStorage
    const saved = getCurrentUser();
    if (saved) {
      setUser(saved);
    }
    setLoading(false);
  }, []);

  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const login = async (email, password) => {
    try {
      const res = await loginCustomer({ email, password });
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`, "success");
      return res;
    } catch (err) {
      showToast(err.message || "Login failed.", "error");
      throw err;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await registerCustomer({ name, email, password, phone });
      setUser(res.user);
      showToast("Account created successfully!", "success");
      return res;
    } catch (err) {
      showToast(err.message || "Registration failed.", "error");
      throw err;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    showToast("You have been signed out.", "info");
  };

  const updateUserProfile = async (data) => {
    try {
      const res = await updateProfile(data);
      setUser(res.user);
      showToast("Profile updated successfully!", "success");
      return res;
    } catch (err) {
      showToast(err.message || "Failed to update profile.", "error");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateUserProfile,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
