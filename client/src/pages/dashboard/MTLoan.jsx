import React from "react";
import "./FundPage.css";

const MTLoan = () => {
  return (
    <div className="fund-page">
      <div className="fund-header">
        <h1>MT Loan</h1>
      </div>

      <div className="fund-summary">
        <h2>Total MT Loan Due</h2>
        <p>₹0.00</p>
      </div>

      <div className="history-card">
        <h3 className="history-title">Monthly EMI Log</h3>

        <div className="history-list">
          <div className="history-item">
            <span>January 2025</span>
            <span className="amount-negative">- ₹1200</span>
          </div>

          <div className="history-item">
            <span>December 2024</span>
            <span className="amount-negative">- ₹1200</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MTLoan;
