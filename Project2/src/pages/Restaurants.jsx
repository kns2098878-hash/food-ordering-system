import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, Sparkles } from "lucide-react";
import { getRestaurants } from "../services/api";
import RestaurantCard from "../components/RestaurantCard";

function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCuisine = searchParams.get("cuisine") || "";
  const initialVeg = searchParams.get("pure_veg") === "true";

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [pureVegOnly, setPureVegOnly] = useState(initialVeg);
  const [sortBy, setSortBy] = useState("rating_desc");

  const cuisines = [
    "All",
    "Biryani & Mughlai",
    "South Indian",
    "Italian & Continental",
    "Pan-Asian & Chinese",
    "Healthy & Salads"
  ];

  const fetchRestaurants = () => {
    setLoading(true);
    const params = {
      q: searchTerm,
      cuisine: selectedCuisine === "All" ? "" : selectedCuisine,
      pure_veg: pureVegOnly ? "true" : "",
      sort_by: sortBy,
    };

    getRestaurants(params)
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading restaurants:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCuisine, pureVegOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>
            Explore Dining & Delivery
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
            Discover top-rated culinary kitchens, verified chef specialties, and reserve tables across Chennai.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="foodie-card" style={{ padding: "20px", marginBottom: "32px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            alignItems: "center"
          }}>
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              padding: "8px 14px",
              border: "1px solid var(--border-warm)"
            }}>
              <Search size={18} color="var(--primary-600)" style={{ marginRight: "10px" }} />
              <input 
                type="text"
                placeholder="Search by restaurant name or dish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  fontSize: "0.95rem"
                }}
              />
            </form>

            {/* Sorting Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <SlidersHorizontal size={18} color="var(--text-muted)" />
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: "10px 14px", borderRadius: "var(--radius-md)" }}
              >
                <option value="rating_desc">Highest Rated (Default)</option>
                <option value="name_asc">Restaurant Name (A - Z)</option>
                <option value="delivery_fee">Lowest Delivery Fee</option>
              </select>
            </div>

            {/* Pure Veg Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600", fontSize: "0.92rem" }}>
                <input 
                  type="checkbox"
                  checked={pureVegOnly}
                  onChange={(e) => setPureVegOnly(e.target.checked)}
                  style={{ accentColor: "var(--primary-600)", width: "18px", height: "18px" }}
                />
                <span>Pure Vegetarian Only</span>
              </label>
            </div>
          </div>

          {/* Cuisine Pill Filters */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "18px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-warm)"
          }}>
            {cuisines.map((c) => {
              const active = selectedCuisine === c || (c === "All" && !selectedCuisine);
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCuisine(c === "All" ? "" : c)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    border: active ? "1.5px solid var(--primary-600)" : "1px solid var(--border-warm)",
                    backgroundColor: active ? "var(--primary-50)" : "#FFFFFF",
                    color: active ? "var(--primary-700)" : "var(--text-dark)",
                    fontWeight: active ? "700" : "500",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Grid */}
        <div style={{ marginBottom: "18px", fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: "600" }}>
          Showing {restaurants.length} {restaurants.length === 1 ? "restaurant" : "restaurants"}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton" style={{ height: "350px", borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="foodie-card" style={{ padding: "60px 20px", textAlign: "center" }}>
            <Sparkles size={48} color="var(--primary-500)" style={{ margin: "0 auto 16px auto" }} />
            <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "8px" }}>No restaurants found</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
              We couldn't find any dining destinations matching your search and filter criteria.
            </p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCuisine("");
                setPureVegOnly(false);
                setSortBy("rating_desc");
              }}
              className="btn-primary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
            {restaurants.map((rest) => (
              <RestaurantCard key={rest.id} restaurant={rest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurants;
