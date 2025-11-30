import React from "react";
import "./FundPage.css";

const ShareFund = () => {
  return (
    <div className="fund-page">
      <div className="fund-header">
        <h1>Share Fund</h1>
      </div>

      <div className="fund-summary">
        <h2>Total Share Fund</h2>
        <p>₹0.00</p>
      </div>

      <div className="history-card">
        <h3 className="history-title">Monthly Log</h3>

        <div className="history-list">
          {/* Dummy items — replace with real data later */}
          <div className="history-item">
            <span>January 2025</span>
            <span className="amount-positive">+ ₹500</span>
          </div>

          <div className="history-item">
            <span>December 2024</span>
            <span className="amount-negative">- ₹300</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareFund;
