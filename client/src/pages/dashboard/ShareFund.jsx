import { useState, useEffect } from "react";

import api from "../../utils/api";
import "./FundPage.css";

const ShareFund = () => {
    const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShareFund();
  }, []);

  const loadShareFund = async () => {
    try {
      const res = await api.get("/fund/share");
      setTotal(res.data.total);
      setHistory(res.data.history);
    } catch (err) {
      console.error("Error loading share fund:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading Share Fund...</p>;
  
 return (
    <div className="fund-page">
      <div className="fund-header">
        <h1>Share Fund</h1>
      </div>

      <div className="fund-summary">
        <h2>Total Share Fund</h2>
        <p>₹{total.toLocaleString("en-IN")}</p>
      </div>

      <div className="history-card">
        <h3 className="history-title">Monthly Log</h3>
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <span>{item.month}</span>
              <span>
                <span className="amount-positive">
                  + ₹{item.incoming.toLocaleString("en-IN")}
                </span>{" "}
                /{" "}
                <span className="amount-negative">
                  {item.outgoing.toLocaleString("en-IN")}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareFund;
