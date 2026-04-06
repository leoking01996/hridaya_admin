import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Admin {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

interface LoginProps {
  onLoginSuccess: (admin: Admin) => void;
}

const AdminLogin: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // default role

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    const res = await fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/admin_login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
if (data.success) {

  alert(data.message);
//   console.log(data)
    const admin: Admin = {
    id: data.admin.id,
    full_name: data.admin.full_name,
    email: data.admin.email,
    role: data.admin.role,
  };
      sessionStorage.setItem("admin", JSON.stringify(admin));
  onLoginSuccess(admin); // pass the correctly typed admin
  setEmail("");
  setPassword("");
  
} else {
      alert(data.message);
    }
  };

  return (
<div className="flex items-center  justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
  <div className="w-full max-w-sm  bg-white rounded-2xl shadow-2xl p-8 transform transition-transform hover:scale-105">
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Admin Login</h2>

<div className="ms-5 text-center ">      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-3 m-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-sm transition"
      />
<br></br>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-3 m-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 shadow-sm transition"
      />
<br></br>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-3 rounded-3 m-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition text-gray-700"
      >
        <option value="admin">Admin</option>
        <option value="super-admin">Super Admin</option>
        <option value="merchant">Merchant</option>

      </select>
<br></br>

      <button className="w-full py-3 rounded-3 m-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition">
        Login
      </button>
</div>
      <p className="text-center text-sm text-gray-500">
        No account?{" "}
        <Link to="/adminRegister" className="text-blue-500 hover:underline font-medium">
          Register
        </Link>
      </p>
    </form>
  </div>
</div>
  );
};

export default AdminLogin;