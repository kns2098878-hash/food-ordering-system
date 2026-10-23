import React, { useState, useEffect } from "react";
import { 
  Wallet as WalletIcon, 
  Award, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react";
import { getWallet, topupWallet, getLoyaltyStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Wallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState(500);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, loyaltyRes] = await Promise.all([
        getWallet(),
        getLoyaltyStatus().catch(() => null)
      ]);
      setWallet(walletRes.wallet);
      setTransactions(walletRes.transactions || []);
      setLoyalty(loyaltyRes);
    } catch (err) {
      console.error("Failed to load wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTopup = async (e) => {
    e.preventDefault();
    if (!topupAmount || topupAmount <= 0) return;
    try {
      setProcessing(true);
      setMessage("");
      const res = await topupWallet(Number(topupAmount));
      setWallet(res.wallet);
      if (res.transaction) {
        setTransactions([res.transaction, ...transactions]);
      }
      setMessage(`🎉 Successfully added ₹${topupAmount} to your wallet!`);
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      alert(err.message || "Top-up failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "3rem 1rem", textAlign: "center" }}>
        <div className="spinner" style={{ margin: "auto" }}></div>
        <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Loading your digital wallet & rewards...</p>
      </div>
    );
  }

  const currentTier = loyalty?.current_tier;
  const nextTier = loyalty?.next_tier;
  const progress = loyalty?.progress_percentage || 0;

  return (
    <div className="container" style={{ padding: "2.5rem 1rem", maxWidth: "1050px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--charcoal)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <WalletIcon className="text-primary" size={32} />
          Foodie Wallet & Rewards
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
          Instant zero-fee checkout, automated cashback, and loyalty tier benefits.
        </p>
      </div>

      {message && (
        <div style={{
          backgroundColor: "#ECFDF5",
          border: "1px solid #A7F3D0",
          color: "#065F46",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <CheckCircle2 size={20} />
          <span>{message}</span>
        </div>
      )}

      {/* Top Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {/* Wallet Balance Card */}
        <div style={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          color: "#FFFFFF",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "#94A3B8" }}>
                Available Balance
              </span>
              <h2 style={{ fontSize: "2.75rem", fontWeight: "800", margin: "0.5rem 0", color: "#F8FAFC" }}>
                ₹{wallet?.balance?.toFixed(2) || "0.00"}
              </h2>
            </div>
            <div style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "0.75rem",
              display: "flex"
            }}>
              <ShieldCheck size={28} color="#38BDF8" />
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#38BDF8", fontSize: "0.9rem" }}>
            <Sparkles size={16} />
            <span>Eligible for 1-Click Fast Checkout at all restaurants</span>
          </div>

          <div style={{
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            color: "#94A3B8"
          }}>
            <span>User: {user?.name || "Customer"}</span>
            <span>Status: {wallet?.is_locked ? "Locked" : "Active & Verified"}</span>
          </div>
        </div>

        {/* Loyalty Tier Card */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "2rem",
          border: "1px solid var(--border-color)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Loyalty Program
              </span>
              <span style={{
                background: currentTier?.badge_color || "#CD7F32",
                color: "#FFFFFF",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: "700"
              }}>
                {currentTier?.tier_name || "Bronze Member"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "1rem" }}>
              <span style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--charcoal)" }}>
                {loyalty?.account?.current_points || 0}
              </span>
              <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Reward Points</span>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Multiplier: <strong>{currentTier?.points_multiplier || "1.00"}x</strong> on every order placed.
            </p>
          </div>

          {nextTier && (
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                <span>Progress to {nextTier.tier_name}</span>
                <span style={{ fontWeight: "700" }}>{progress}%</span>
              </div>
              <div style={{ height: "8px", background: "#F1F5F9", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #F97316 0%, #EA580C 100%)",
                  borderRadius: "4px"
                }}></div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Spend ₹{loyalty?.spend_needed_for_next_tier?.toFixed(2) || "0.00"} more to unlock {nextTier.tier_name}!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Top-Up Section */}
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "2rem",
        border: "1px solid var(--border-color)",
        marginBottom: "2rem"
      }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PlusCircle size={22} className="text-primary" />
          Add Money to Wallet (Instant Simulation)
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
          Select a quick amount or enter custom funds to simulate an instant UPI/NetBanking wallet top-up.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
          {[100, 250, 500, 1000, 2000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setTopupAmount(amt)}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                border: topupAmount === amt ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                background: topupAmount === amt ? "rgba(249, 115, 22, 0.1)" : "white",
                color: topupAmount === amt ? "var(--primary)" : "var(--charcoal)",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              + ₹{amt}
            </button>
          ))}
        </div>

        <form onSubmit={handleTopup} style={{ display: "flex", gap: "1rem", maxWidth: "450px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontWeight: "700", color: "var(--charcoal)" }}>
              ₹
            </span>
            <input
              type="number"
              min="1"
              max="10000"
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
              className="form-control"
              style={{ paddingLeft: "2.25rem", height: "46px", fontSize: "1rem" }}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={processing}
            style={{ padding: "0 1.75rem", height: "46px", whiteSpace: "nowrap" }}
          >
            {processing ? "Adding..." : "Add Money"}
          </button>
        </form>
      </div>

      {/* Transactions Ledger */}
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "2rem",
        border: "1px solid var(--border-color)"
      }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <TrendingUp size={22} className="text-primary" />
          Wallet Transactions & Audit Ledger
        </h3>

        {transactions.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
            No wallet transactions recorded yet.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #F1F5F9", textAlign: "left", color: "var(--text-muted)" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>Type</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Description</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Date</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Amount</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isCredit = tx.transaction_type === "credit" || tx.transaction_type === "cashback";
                  return (
                    <tr key={tx.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                      <td style={{ padding: "1rem" }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.3rem 0.65rem",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          backgroundColor: isCredit ? "#DCFCE7" : "#FEE2E2",
                          color: isCredit ? "#15803D" : "#B91C1C"
                        }}>
                          {isCredit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          {tx.transaction_type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontWeight: "500", color: "var(--charcoal)" }}>
                        {tx.description}
                      </td>
                      <td style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {tx.created_at ? new Date(tx.created_at).toLocaleString() : "Just now"}
                      </td>
                      <td style={{
                        padding: "1rem",
                        textAlign: "right",
                        fontWeight: "700",
                        color: isCredit ? "#15803D" : "#B91C1C"
                      }}>
                        {isCredit ? "+" : "-"} ₹{tx.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "right", fontWeight: "600", color: "var(--charcoal)" }}>
                        ₹{tx.balance_after.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
