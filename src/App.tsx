import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./components/auth/login/login";
import MerchantLogin from "./components/auth/login/MerchantLogin";
import AdminRegister from "./components/auth/register";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import MerchantDashboard from "./components/dashboard/MerchantDashboard";
import ProductDetail from "./components/product-details/product-detail";
import ProductTypeEditForm from "./components/productType/productType";
import MainPage from "./components/MainPage";

interface Admin {
  id: number;
  full_name: string;
  email: string;
  role: string;
}
interface Merchant {
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

  const [merchant, setMerchant] = useState<Merchant | null>(() => {
    const stored = sessionStorage.getItem("merchant");
    return stored ? JSON.parse(stored) : null;
  });

  const handleAdminLoginSuccess = (adminData: Admin) => {
    setAdmin(adminData);
    sessionStorage.setItem("admin", JSON.stringify(adminData));
  };

  const handleMerchantLoginSuccess = (merchantData: Merchant) => {
    setMerchant(merchantData);
    sessionStorage.setItem("merchant", JSON.stringify(merchantData));
  };

  const handleLogout = () => {
    setAdmin(null);
    setMerchant(null);
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("merchant");
  };

  return (
    <Router>
      <Routes>
        {/* Main landing page */}
        <Route path="/" element={<MainPage />} />

        {/* Admin login */}
        <Route
          path="/admin_login"
          element={
            admin ? <Navigate to="/dashboard" /> : <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
          }
        />

        {/* Merchant login */}
        <Route
          path="/merchant_login"
          element={
            merchant ? <Navigate to="/merchant/dashboard" /> : <MerchantLogin onLoginSuccess={handleMerchantLoginSuccess} />
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/dashboard"
          element={admin ? <AdminDashboard admin={admin} onLogout={handleLogout} /> : <Navigate to="/" />}
        />

        {/* Merchant dashboard */}
     <Route
  path="/merchant/dashboard"
  element={<MerchantDashboard />}
/>

        {/* Product detail */}
        <Route
          path="/profileDetail"
          element={
            <div className="flex justify-center items-center min-h-screen">
              <ProductDetail />
            </div>
          }
        />

        {/* Edit product type */}
        <Route
          path="/Edit_profileDetail"
          element={
            <div className="flex justify-center items-center min-h-screen">
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