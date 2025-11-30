import React from "react";
import "./FundPage.css";

const OwnFund = () => {
  return (
    <div className="fund-page">
      <div className="fund-header">
        <h1>Own Fund Loan</h1>
      </div>

      <div className="fund-summary">
        <h2>Total Own Fund Due</h2>
        <p>₹0.00</p>
      </div>

      <div className="history-card">
        <h3 className="history-title">Monthly Log</h3>

        <div className="history-list">
          <div className="history-item">
            <span>January 2025</span>
            <span className="amount-negative">- ₹900</span>
          </div>

          <div className="history-item">
            <span>December 2024</span>
            <span className="amount-positive">+ ₹400</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnFund;
