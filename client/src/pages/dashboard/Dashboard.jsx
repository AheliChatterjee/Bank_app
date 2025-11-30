import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AccountSummary from "./AccountSummary";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

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
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>
          Welcome, {user?.name || user?.email || "User"}
        </h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {bankData ? (
          <AccountSummary data={bankData} />
        ) : (
          <p className="loading-text">Loading account summary...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
