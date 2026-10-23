import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  Phone, 
  CalendarDays, 
  MessageSquare, 
  Send,
  Leaf
} from "lucide-react";
import { getRestaurant, getRestaurantMenu, getRestaurantReviews, submitReview } from "../services/api";
import FoodCard from "../components/FoodCard";
import FoodModal from "../components/FoodModal";
import { useAuth } from "../context/AuthContext";

function RestaurantMenu() {
  const { id } = useParams();
  const { user, isAuthenticated, showToast } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("menu"); // "menu" or "reviews"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getRestaurant(id),
      getRestaurantMenu(id),
      getRestaurantReviews(id)
    ])
      .then(([restData, menuData, reviewData]) => {
        setRestaurant(restData);
        setMenuItems(menuData);
        setReviews(reviewData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load restaurant details:", err);
        setLoading(false);
      });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Please login to post a review.", "error");
      return;
    }
    if (!newComment.trim()) {
      showToast("Please enter a review comment.", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await submitReview(id, {
        rating: Number(newRating),
        comment: newComment.trim()
      });
      setReviews((prev) => [res.review, ...prev]);
      setNewComment("");
      showToast("Thank you for your review!", "success");
    } catch (err) {
      showToast(err.message || "Failed to submit review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper container">
        <div className="skeleton" style={{ height: "240px", borderRadius: "var(--radius-xl)", marginBottom: "32px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton" style={{ height: "300px", borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="page-wrapper container" style={{ textAlign: "center", padding: "80px 0" }}>
        <h2>Restaurant Not Found</h2>
        <p style={{ color: "var(--text-muted)", margin: "16px 0 24px 0" }}>The restaurant you are looking for does not exist or has been retired.</p>
        <Link to="/restaurants" className="btn-primary">Back to Explore</Link>
      </div>
    );
  }

  // Extract unique category names
  const categories = ["All", ...new Set(menuItems.map((item) => item.category_name).filter(Boolean))];

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter((i) => i.category_name === selectedCategory);

  return (
    <div className="page-wrapper" style={{ padding: "0 0 64px 0" }}>
      {/* 1. RESTAURANT HERO BANNER */}
      <div style={{
        position: "relative",
        background: "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(" + (restaurant.banner_url || restaurant.image_url) + ") center/cover",
        color: "#FFFFFF",
        padding: "60px 0 50px 0",
        marginBottom: "32px"
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "24px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span className="badge badge-primary">{restaurant.cuisine_type}</span>
                {restaurant.is_pure_veg && (
                  <span className="badge badge-veg">
                    <Leaf size={12} /> Pure Veg
                  </span>
                )}
                <span style={{ fontSize: "0.85rem", color: "#CBD5E1", fontWeight: "600" }}>{restaurant.price_tier}</span>
              </div>

              <h1 style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: "800",
                fontFamily: "var(--font-serif)",
                color: "#FFFFFF",
                marginBottom: "8px"
              }}>
                {restaurant.name}
              </h1>

              <p style={{ color: "#E2E8F0", fontSize: "1rem", maxWidth: "600px", marginBottom: "16px", lineHeight: "1.6" }}>
                {restaurant.description || restaurant.tagline}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "0.9rem", color: "#CBD5E1" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={16} color="var(--primary-500)" />
                  <span>{restaurant.address}, {restaurant.city}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={16} color="var(--primary-500)" />
                  <span>{restaurant.estimated_delivery_time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Bike size={16} color="var(--primary-500)" />
                  <span>₹{Number(restaurant.delivery_fee).toFixed(0)} Delivery Fee</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Rating Pill */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-end" }}>
              <div style={{
                backgroundColor: "#FFFFFF",
                color: "var(--text-dark)",
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "var(--shadow-lg)"
              }}>
                <Star size={20} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontWeight: "800", fontSize: "1.2rem" }}>{Number(restaurant.rating).toFixed(1)}</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>({restaurant.rating_count} reviews)</span>
              </div>

              <Link 
                to={`/reservation?restaurant_id=${restaurant.id}`} 
                className="btn-primary"
                style={{ padding: "12px 24px" }}
              >
                <CalendarDays size={18} /> Book a Table Here
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABS & MENU NAVIGATION */}
      <div className="container">
        <div style={{
          display: "flex",
          borderBottom: "2px solid var(--border-warm)",
          marginBottom: "32px",
          gap: "28px"
        }}>
          <button
            onClick={() => setActiveTab("menu")}
            style={{
              padding: "12px 0",
              background: "none",
              border: "none",
              borderBottom: activeTab === "menu" ? "3px solid var(--primary-600)" : "3px solid transparent",
              color: activeTab === "menu" ? "var(--primary-600)" : "var(--text-muted)",
              fontWeight: "700",
              fontSize: "1.05rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Order Menu ({menuItems.length})
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            style={{
              padding: "12px 0",
              background: "none",
              border: "none",
              borderBottom: activeTab === "reviews" ? "3px solid var(--primary-600)" : "3px solid transparent",
              color: activeTab === "reviews" ? "var(--primary-600)" : "var(--text-muted)",
              fontWeight: "700",
              fontSize: "1.05rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}
          >
            <MessageSquare size={18} />
            <span>Customer Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* 3. MENU TAB CONTENT */}
        {activeTab === "menu" && (
          <div>
            {/* Category Filter Pills */}
            <div style={{
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              paddingBottom: "16px",
              marginBottom: "28px"
            }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "9999px",
                    border: selectedCategory === cat ? "1.5px solid var(--primary-600)" : "1px solid var(--border-warm)",
                    backgroundColor: selectedCategory === cat ? "var(--primary-600)" : "#FFFFFF",
                    color: selectedCategory === cat ? "#FFFFFF" : "var(--text-dark)",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: selectedCategory === cat ? "var(--shadow-orange)" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            {filteredItems.length === 0 ? (
              <div className="foodie-card" style={{ padding: "40px", textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)" }}>No dishes found in this category.</p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px"
              }}>
                {filteredItems.map((item) => (
                  <FoodCard 
                    key={item.id} 
                    item={item} 
                    restaurant={restaurant} 
                    onSelectCustomization={(it) => setSelectedItemForModal(it)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. REVIEWS TAB CONTENT */}
        {activeTab === "reviews" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
            {/* Review Submission Form */}
            <div className="foodie-card" style={{ padding: "28px", height: "fit-content" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px" }}>Write a Dining Review</h3>
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px"
                          }}
                        >
                          <Star 
                            size={28} 
                            color="#F59E0B" 
                            fill={star <= newRating ? "#F59E0B" : "none"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Comments & Experience</label>
                    <textarea 
                      className="form-textarea"
                      rows={4}
                      placeholder="Share your experience about food quality, taste, delivery, and ambiance..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={submittingReview}
                    style={{ width: "100%" }}
                  >
                    <Send size={16} />
                    <span>{submittingReview ? "Submitting..." : "Post Review"}</span>
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                    Please sign in with your account to share your culinary feedback.
                  </p>
                  <Link to="/login" className="btn-primary btn-sm">Sign In to Review</Link>
                </div>
              )}
            </div>

            {/* Existing Reviews List */}
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>
                Customer Feedback ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <div className="foodie-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  Be the first gourmet lover to leave a review for {restaurant.name}!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} className="foodie-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary-100)",
                            color: "var(--primary-700)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700"
                          }}>
                            {rev.user_name[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{rev.user_name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ""}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2px" }}>
                          {[...Array(rev.rating)].map((_, idx) => (
                            <Star key={idx} size={16} color="#F59E0B" fill="#F59E0B" />
                          ))}
                        </div>
                      </div>

                      <p style={{ color: "var(--text-dark)", fontSize: "0.92rem", lineHeight: "1.6" }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. FOOD DETAIL & CUSTOMIZATION MODAL */}
      {selectedItemForModal && (
        <FoodModal 
          item={selectedItemForModal} 
          restaurant={restaurant} 
          onClose={() => setSelectedItemForModal(null)} 
        />
      )}
    </div>
  );
}

export default RestaurantMenu;
