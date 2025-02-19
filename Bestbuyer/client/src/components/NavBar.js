import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  // Optional: retrieve user from localStorage to show user-specific links
  const user = JSON.parse(localStorage.getItem("user")) || null;

  return (
    <nav className="navbar">
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        <h2>BestBuyer Appliances</h2>
      </Link>
      <div>
        <Link to="/cart" style={{ color: "#fff", marginRight: "1rem" }}>
          Cart
        </Link>
        {user && user.isAdmin && (
          <Link to="/admin" style={{ color: "#fff", marginRight: "1rem" }}>
            Admin
          </Link>
        )}
        {user ? (
          <span style={{ color: "#fff", marginRight: "1rem" }}>
            Hello, {user.name}
          </span>
        ) : (
          <>
            <Link to="/login" style={{ color: "#fff", marginRight: "1rem" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "#fff" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
