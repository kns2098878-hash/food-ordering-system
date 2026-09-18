import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const data = JSON.parse(savedUser);
      setUser(data);
    } catch (error) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return (
      <main>
        <h1>My Profile</h1>
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Profile</h1>

      <div className="profile-card">

        <h2>Profile Details</h2>

        <p>
          <strong>Name:</strong>{" "}
          {user.name || user.full_name || "Not available"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user.email || "Not available"}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {user.phone || user.mobile || "Not available"}
        </p>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>

      </div>
    </main>
  );
}

export default Profile;