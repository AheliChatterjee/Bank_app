import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AccountSummary from "./AccountSummary";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bankData, setBankData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/bank/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBankData(res.data);
      } catch (err) {
        console.error("Failed to load bank data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name || user?.email || "User"}
        </h1>
        <button
          onClick={logout}
          className=" bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {bankData ? (
        <AccountSummary data={bankData} />
      ) : (
        <p className="text-gray-600">Loading account summary...</p>
      )}
    </div>
  );
};

export default Dashboard;
