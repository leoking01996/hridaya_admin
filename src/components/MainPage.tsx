import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      <div className="text-center p-8 bg-white shadow-2xl rounded-2xl">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome!</h1>
        <p className="text-gray-600 mb-8">Please select your login type:</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 m-1 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition"
            onClick={() => navigate("/admin_login")}
          >
            Admin
          </button>
          <button
            className="px-6 m-1 py-3 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition"
            onClick={() => navigate("/merchant_login")}
          >
            Merchant
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;