import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.jpg";
import "../styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (username === "admin@admin" && password === "admin") {
        navigate("/admin");
      } else if (user) {
        if (username.includes("@admin")) {
          navigate("/admin");
        } else if (username.includes("@billdesk")) {
          navigate("/billdesk");
        } else {
          alert("Access denied!");
        }
      } else {
        alert("Invalid username or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="login-page-container">
      {/* Left - Image */}
      <div className="image-section">
        <img src={loginImage} alt="Login" />
      </div>

      {/* Right - Login */}
      <div className="form-section">
        <div className="login-box">
          <h2 className="gradient-heading">Welcome Back!</h2>
          <p className="subtitle">
            Please log in to continue managing your inventory with Inventrack.
          </p>

          <input
            type="text"
            placeholder="Enter your username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
