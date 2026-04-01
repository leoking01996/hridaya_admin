import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


interface RegisterForm {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

const AdminRegister: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    full_name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ full_name: "", email: "", password: "" });

  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors = { full_name: "", email: "", password: "" };
    let isValid = true;

    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost/backend_php_hridaya/hridaya-admin-backend/register_admin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        alert("Registration successful! Please login.");
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Register</h2>

        {/* Full Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            placeholder="Enter full name"
            value={form.full_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col relative">
          <label className="mb-1 text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="admin">Admin</option>
            <option value="super-admin">Super Admin</option>
          </select>
        </div>

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Register
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/")}>
            <Link to={'/login'}>Login</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;