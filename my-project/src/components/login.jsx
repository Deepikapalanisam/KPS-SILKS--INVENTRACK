import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.jpg";
import "../styles/login.css";

export default function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // If the user is already logged in, redirect them to the admin page
  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (username === "admin@admin" && password === "admin@9876") {
        localStorage.setItem("loggedIn", "true");
        navigate("/admin");
      } else if (user) {
        if (username.includes("@admin")) {
          localStorage.setItem("loggedIn", "true");
          navigate("/admin");
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
      <div className="image-section">
        <img src={loginImage} alt="Login" />
      </div>

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
