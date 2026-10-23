import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CalendarDays, 
  Tag, 
  Star,
  Quote
} from "lucide-react";
import { getRestaurants } from "../services/api";
import RestaurantCard from "../components/RestaurantCard";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getRestaurants({ sort_by: "rating_desc" })
      .then((data) => {
        setRestaurants(data.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load restaurants:", err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const categories = [
    { name: "Biryani & Kebabs", icon: "🍗", query: "Biryani" },
    { name: "South Indian Tiffins", icon: "🥞", query: "South Indian" },
    { name: "Artisanal Pizza", icon: "🍕", query: "Italian" },
    { name: "Pan-Asian Wok", icon: "🥢", query: "Pan-Asian" },
    { name: "Pure Veg & Bowls", icon: "🥗", query: "Healthy" },
    { name: "Desserts & Shakes", icon: "🍨", query: "Dessert" },
  ];

  return (
    <div className="page-wrapper" style={{ padding: "0" }}>
      {/* 1. HERO SECTION */}
      <section style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, var(--bg-warm) 100%)",
        padding: "60px 0 80px 0",
        borderBottom: "1px solid var(--border-warm)"
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "50px",
            alignItems: "center"
          }}>
            {/* Left Hero Text */}
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                backgroundColor: "var(--primary-100)",
                color: "var(--primary-700)",
                borderRadius: "9999px",
                fontWeight: "700",
                fontSize: "0.85rem",
                marginBottom: "20px"
              }}>
                <Sparkles size={16} />
                <span>Next-Gen Culinary Experience</span>
              </div>

              <h1 style={{
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                fontWeight: "800",
                letterSpacing: "-0.03em",
                lineHeight: "1.15",
                marginBottom: "20px",
                fontFamily: "var(--font-serif)"
              }}>
                Feast on your <br />
                <span style={{ color: "var(--primary-600)" }}>favorite flavors</span>, <br />
                delivered or reserved.
              </h1>

              <p style={{
                fontSize: "1.1rem",
                color: "var(--text-muted)",
                lineHeight: "1.7",
                marginBottom: "32px",
                maxWidth: "520px"
              }}>
                Order gourmet meals from top-rated kitchens or reserve prime dining tables with zero booking fees in Chennai.
              </p>

              {/* Hero Search Box */}
              <form onSubmit={handleSearchSubmit} style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: "var(--radius-lg)",
                padding: "8px 10px 8px 18px",
                boxShadow: "var(--shadow-lg)",
                border: "1.5px solid var(--border-warm)",
                maxWidth: "500px",
                marginBottom: "20px"
              }}>
                <Search size={20} color="var(--primary-600)" style={{ marginRight: "12px", flexShrink: 0 }} />
                <input 
                  type="text" 
                  placeholder="What are you craving today?" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "0.98rem",
                    width: "100%",
                    color: "var(--text-dark)"
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: "10px 22px" }}>
                  Find Food
                </button>
              </form>

              {/* Quick Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <span>Popular:</span>
                {["Biryani", "Dosa", "Pizza", "Noodles", "Healthy Bowl"].map((tag) => (
                  <Link 
                    key={tag} 
                    to={`/restaurants?q=${tag}`}
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontWeight: "600",
                      color: "var(--text-dark)"
                    }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div style={{ position: "relative" }}>
              <div style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-xl)",
                border: "4px solid #FFFFFF",
                position: "relative"
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000" 
                  alt="Delicious banquet"
                  style={{ width: "100%", height: "450px", objectFit: "cover" }}
                />
              </div>

              {/* Floating Promo Pill */}
              <div style={{
                position: "absolute",
                bottom: "-20px",
                left: "-20px",
                backgroundColor: "#FFFFFF",
                padding: "16px 22px",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                border: "1px solid var(--border-warm)"
              }}>
                <div style={{
                  backgroundColor: "var(--primary-100)",
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary-600)"
                }}>
                  <Tag size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: "800", color: "var(--text-dark)", fontSize: "0.95rem" }}>
                    Flat 50% OFF
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Use code <strong style={{ color: "var(--primary-600)" }}>FOODIE50</strong>
                  </div>
                </div>
              </div>

              {/* Floating Table Reservation Pill */}
              <div style={{
                position: "absolute",
                top: "-15px",
                right: "-15px",
                backgroundColor: "#FFFFFF",
                padding: "14px 20px",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: "1px solid var(--border-warm)"
              }}>
                <CalendarDays size={22} color="var(--primary-600)" />
                <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>
                  Instant Table Confirmation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section style={{ padding: "40px 0", backgroundColor: "#FFFFFF", borderBottom: "1px solid var(--border-warm)" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px"
          }}>
            {[
              { icon: <Clock size={28} color="var(--primary-600)" />, title: "30-40 Mins Delivery", desc: "Express delivery hot to your doorstep" },
              { icon: <CalendarDays size={28} color="var(--primary-600)" />, title: "Live Table Booking", desc: "Pick your exact table with 0 waiting time" },
              { icon: <ShieldCheck size={28} color="var(--primary-600)" />, title: "Verified Hygiene", desc: "Top tier sanitary and kitchen inspections" },
              { icon: <Tag size={28} color="var(--primary-600)" />, title: "Exciting Promo Codes", desc: "Save up to ₹150 on your orders daily" },
            ].map((feature, idx) => (
              <div key={idx} style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--bg-surface)"
              }}>
                <div style={{ flexShrink: 0 }}>{feature.icon}</div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700" }}>{feature.title}</h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES CAROUSEL / GRID */}
      <section style={{ padding: "64px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "8px" }}>Explore Cuisines</span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: "800", fontFamily: "var(--font-serif)" }}>
                Popular Food Categories
              </h2>
            </div>
            <Link to="/restaurants" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary-600)", fontWeight: "700" }}>
              <span>View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "18px"
          }}>
            {categories.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/restaurants?cuisine=${encodeURIComponent(cat.query)}`}
                className="foodie-card"
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  cursor: "pointer"
                }}
              >
                <div style={{ fontSize: "2.5rem" }}>{cat.icon}</div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "700" }}>{cat.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED RESTAURANTS */}
      <section style={{ padding: "40px 0 80px 0", backgroundColor: "#FFFFFF", borderTop: "1px solid var(--border-warm)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px" }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "8px" }}>Handpicked For You</span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: "800", fontFamily: "var(--font-serif)" }}>
                Featured Dining Destinations
              </h2>
            </div>
            <Link to="/restaurants" className="btn-secondary btn-sm">
              Explore All Restaurants
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton" style={{ height: "350px", borderRadius: "var(--radius-lg)" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
              {restaurants.map((rest) => (
                <RestaurantCard key={rest.id} restaurant={rest} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. PROMO / COUPONS BANNER */}
      <section style={{ padding: "64px 0", background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)", color: "#FFFFFF" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            alignItems: "center"
          }}>
            <div>
              <span className="badge badge-warning" style={{ marginBottom: "12px" }}>Exclusive Promotion</span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#FFFFFF", marginBottom: "16px", fontFamily: "var(--font-serif)" }}>
                Unlock Instant Savings with Foodie Promo Codes
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "1rem", lineHeight: "1.7", marginBottom: "24px" }}>
                Apply verified promo codes directly during checkout for flat discounts, free delivery waivers, and percentage savings up to ₹150.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "1px dashed var(--primary-500)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <strong style={{ color: "var(--primary-500)", fontSize: "1.1rem" }}>FOODIE50</strong>
                  <span style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>50% off orders above ₹200</span>
                </div>
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "1px dashed var(--primary-500)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <strong style={{ color: "var(--primary-500)", fontSize: "1.1rem" }}>WELCOME100</strong>
                  <span style={{ fontSize: "0.85rem", color: "#CBD5E1" }}>₹100 flat discount</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <Link to="/restaurants" className="btn-primary" style={{ padding: "16px 36px", fontSize: "1.05rem" }}>
                Start Ordering Now <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section style={{ padding: "64px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px auto" }}>
            <span className="badge badge-primary" style={{ marginBottom: "8px" }}>Customer Voices</span>
            <h2 style={{ fontSize: "1.85rem", fontWeight: "800", fontFamily: "var(--font-serif)" }}>
              What Our Food Lovers Say
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { name: "Riharika Rao", role: "Food Critic & Designer", text: "The Royal Biryani House dum biryani was steaming hot and perfectly seasoned. Reserving a table beforehand saved us 45 minutes on a Saturday evening!" },
              { name: "Sriram Krishnan", role: "Software Architect", text: "Dakshin Flavors Ghee Roast Dosa took me right back to authentic traditional flavors. The online checkout with instant coupon redemption is seamless." },
              { name: "Ananya Sharma", role: "Gastronomy Enthusiast", text: "Little Italy's burrata pizza is truly authentic Napoli style. Having the table reservation and food ordering in one cohesive platform is brilliant." },
            ].map((testi, i) => (
              <div key={i} className="foodie-card" style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <Quote size={32} color="var(--primary-200)" style={{ marginBottom: "14px" }} />
                  <p style={{ color: "var(--text-dark)", fontSize: "0.95rem", lineHeight: "1.7", marginBottom: "20px" }}>
                    "{testi.text}"
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-100)",
                    color: "var(--primary-700)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700"
                  }}>
                    {testi.name[0]}
                  </div>
                  <div>
                    <h5 style={{ fontSize: "0.95rem", fontWeight: "700" }}>{testi.name}</h5>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{testi.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
