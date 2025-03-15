import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import "../styles/landingPage.css";

// Import SVG icons as modules
import statsIcon from "../assets/icons/stats.svg";
import stockIcon from "../assets/icons/stock.svg";
import customersIcon from "../assets/icons/customers.svg";
import profileIcon from "../assets/icons/profile.svg";

const LandingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Assumption: Registration status is stored in localStorage as a "registered" flag.
  const isRegistered = localStorage.getItem("registered");

  const handleMainAction = () => {
    if (user) {
      // If the user is logged in, log them out.
      logout();
    } else {
      // Navigate to the auth page for login/registration.
      navigate("/auth");
    }
  };

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to our Inventory Management System!</h1>
      </header>

      <section className="landing-intro">
        <p>
          Discover our services designed to empower your business and enhance your digital experience.
        </p>
        <Button onClick={handleMainAction} className="landing-action-button">
          {user ? "Log Out" : isRegistered ? "Log In" : "Register"}
        </Button>
      </section>

      <section className="landing-features">
        <h2>Our Features</h2>
        <div className="features-grid">

          <div className="feature-item">
            {/* Icon placeholder */}
            <img
              src={statsIcon}
              alt="Dashboard Icon"
              className="feature-icon"
            />
            <h3>Dashboard</h3>
            <p>
              Access real-time insights and analytics of your products stock and customers details.
            </p>
          </div>

          <div className="feature-item">
            {/* Icon placeholder */}
            <img
              src={stockIcon}
              alt="Products Stock Icon"
              className="feature-icon"
            />
            <h3>Products stock Management</h3>
            <p>
              Easily manage and display your products in a practical interface that includes categories and prices.
            </p>
          </div>

          <div className="feature-item">
            {/* Icon placeholder */}
            <img
              src={customersIcon}
              alt="Customers Icon"
              className="feature-icon"
            />
            <h3>Customers Management</h3>
            <p>
              Organize your clients contacts for improved customer relationship and management.
            </p>
          </div>

          <div className="feature-item">
            {/* Icon placeholder */}
            <img
              src={profileIcon}
              alt="Profile Icon"
              className="feature-icon"
            />
            <h3>Profile</h3>
            <p>
              Manage your account settings and personal information effortlessly.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
