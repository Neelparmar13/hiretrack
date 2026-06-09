import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={nav}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#185FA5" }}>HireTrack</span>
        <div style={{ display: "flex", gap: 4 }}>
          <Link to="/dashboard" style={{ ...navLink, ...(isActive("/dashboard") ? activeLink : {}) }}>
            Dashboard
          </Link>
          <Link to="/analytics" style={{ ...navLink, ...(isActive("/analytics") ? activeLink : {}) }}>
            Analytics
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: "#555" }}>Hi, {user?.name?.split(" ")[0]}</span>
        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const nav = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "12px 24px",
  borderBottom: "0.5px solid #e8e8e8",
  background: "#fff",
  position: "sticky", top: 0, zIndex: 100,
};
const navLink = {
  fontSize: 13, padding: "6px 12px",
  borderRadius: 7, textDecoration: "none",
  color: "#555", fontWeight: 400,
};
const activeLink = {
  background: "#EBF3FC", color: "#185FA5", fontWeight: 500,
};
const logoutBtn = {
  fontSize: 13, padding: "5px 14px",
  border: "0.5px solid #ddd", borderRadius: 8,
  cursor: "pointer", background: "transparent", color: "#555",
};