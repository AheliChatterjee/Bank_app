import { useState, useEffect } from "react";

import api from "../../utils/api";
import "./FundPage.css";

const MTLoan = () => {
  const [loans, setLoans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoanData();
  }, []);

  const loadLoanData = async () => {
    try {
      const res = await api.get("/fund/mt");
      setLoans(res.data.loans);
      setLogs(res.data.logs);
    } catch (err) {
      console.error("MT Loan Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading MT Loan...</p>;

  const loan = loans.length > 0 ? loans[0] : null;

  return (
    <div className="fund-page">
      <div className="fund-header">
        <h1>MT Loan</h1>
      </div>

      <div className="fund-summary">
        <h2>Remaining MT Loan Due</h2>
        <p>₹{loan?.remainingAmount?.toLocaleString("en-IN") || "0"}</p>
      </div>

      <div className="history-card">
        <h3 className="history-title">Monthly EMI Log</h3>

        <div className="history-list">
          {logs.map((item, index) => (
            <div key={index} className="history-item">
              <span>{item.month}</span>
              <span
                className={
                  item.status === "paid" ? "amount-negative" : "amount-positive"
                }
              >
                ₹{item.emiAmount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MTLoan;