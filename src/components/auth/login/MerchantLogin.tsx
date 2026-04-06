import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Merchant {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

interface LoginProps {
  onLoginSuccess: (merchant: Merchant) => void;
}

const MerchantLogin: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("merchant"); // default role

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/backend_php_hridaya/merchant-backend/login_merchant.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        }
      );
      const data = await res.json();
console.log(data,'96666')
    if (data.success) {
  alert(data.message);

  const merchant: Merchant = {
    id: data.user.id,
    full_name: data.user.full_name,
    email: data.user.email,
    role: 'merchant',
  };
  sessionStorage.setItem("merchant", JSON.stringify(merchant));
  onLoginSuccess(merchant);

  setEmail("");
  setPassword("");
} else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 transform transition-transform hover:scale-105">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Merchant Login
          </h2>

          <div className="ms-5 text-center">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 m-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-sm transition"
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 m-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-sm transition"
            />
            <br />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 m-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition text-gray-700"
            >
              <option value="merchant">Merchant</option>
            </select>
            <br />
            <button className="w-full py-3 m-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition">
              Login
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            No account?{" "}
            <Link
              to="/adminRegister"
              className="text-blue-500 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default MerchantLogin;