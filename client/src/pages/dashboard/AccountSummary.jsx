import React from "react";
import { useNavigate } from "react-router-dom";
import "./AccountSummary.css";

const AccountSummary = ({ data }) => {
  const navigate = useNavigate();

  const summaryItems = [
    { label: "Share Fund", key: "shareFund", path: "/fund/share" },
    { label: "Thrift Fund", key: "thriftFund", path: "/fund/thrift" },
    { label: "MT Loan", key: "mtLoan", path: "/fund/mtloan" },
    { label: "Own Fund", key: "ownFund", path: "/fund/own" },
  ];

  return (
    <div className="summary-card">
      <h2 className="summary-title">Account Summary</h2>

      <div className="summary-grid">
        {summaryItems.map((item) => (
          <div
            key={item.key}
            className="summary-box"
            onClick={() => navigate(item.path)}
          >
            <h3 className="summary-label">{item.label}</h3>
            <p className="summary-value">
              ₹{data?.[item.key]?.toLocaleString("en-IN") || "0.00"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountSummary;
