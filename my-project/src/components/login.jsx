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
      
      const user = users.find(u => u.username === username && u.password === password);

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
    <div className="flex h-screen w-full">
      {/* Left Side - Login Form */}
      <div className="h-full flex flex-col justify-center items-center bg-gray-100 p-10">
        <h2 className="text-7xl font-bold font-carattere text-pink-600">Welcome to Inventrack</h2>
        <p className="text-lg mt-3 text-center">Your Reliable Inventory Management Tool</p>
        <div className="mt-8"></div>
        <input
          type="text"
          placeholder="Username"
          className="w-80 p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-80 p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className="w-80 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>

      {/* Right Side - Image & Text */}
      <div className="w-1/2 h-full flex flex-col justify-center items-center bg-blue-500 text-white p-10">
        <img src={loginImage} alt="Login" className="w-full h-full object-cover rounded-lg shadow-lg" />
      </div>
    </div>
  );
}
