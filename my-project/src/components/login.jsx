import loginImage from '../assets/login.jpg';
import '../styles/login.css';
export default function Login() {
  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Login Form */}
      <div className=" h-full flex flex-col justify-center items-center bg-gray-100 p-10">
        <h2 className="text-7xl font-bold font-carattere text-pink-600">Welcome to Inventrack</h2>
        <p className="text-lg mt-3 text-center">Your Reliable Inventory Management Tool</p>
        <div className="mt-8"></div>  
        <input
          type="text"
          placeholder="Username"
          className="w-80 p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-80 p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="w-80 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">Login</button>
      </div>

      {/* Right Side - Image & Text */}
      <div className="w-1/2 h-full flex flex-col justify-center items-center bg-blue-500 text-white p-10">
        <img src={loginImage} alt="Login" className="w-full h-full object-cover rounded-lg shadow-lg" />
      </div>
    </div>
  );
}
