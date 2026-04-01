import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./components/auth/login/login";
import AdminRegister from "./components/auth/register";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ProductDetail from "./components/product-details/product-detail";
import ProductTypeEditForm from "./components/productType/productType";


interface Admin {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

function App() {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = sessionStorage.getItem("admin");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLoginSuccess = (adminData: Admin) => {
    setAdmin(adminData);
    sessionStorage.setItem("admin", JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setAdmin(null);
    sessionStorage.removeItem("admin");
  };

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/"
          element={
            admin ? <Navigate to="/dashboard" /> : <AdminLogin onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={
            admin ? (
              <div className="">
                <AdminDashboard admin={admin} onLogout={handleLogout} />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
            <Route
          path="/profileDetail"
          element={
            <div className="flex justify-center items-center min-h-screen ">
              <ProductDetail />
            </div>
          }
        />
              <Route
          path="/Edit_profileDetail"
          element={
            <div className="flex justify-center items-center min-h-screen ">
              <ProductTypeEditForm />
            </div>
          }
        />

        {/* Admin register */}
        <Route
          path="/adminRegister"
          element={
            <div className="flex justify-center items-center min-h-screen">
              <AdminRegister />
            </div>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;