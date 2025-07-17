import React from "react";
import { useNavigate } from "react-router-dom";

const AccountSummary = ({ data }) => {
  const navigate = useNavigate();

  const summaryItems = [
    { label: "Share Fund", key: "shareFund", path: "/fund/share" },
    { label: "Thrift Fund", key: "thriftFund", path: "/fund/thrift" },
    { label: "MT Loan", key: "mtLoan", path: "/fund/mtloan" },
    { label: "Own Fund", key: "ownFund", path: "/fund/own" },
  ];

  return (
    <div className="bg-white shadow p-6 rounded mb-6">
      <h2 className="text-2xl font-semibold mb-4">Account Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summaryItems.map((item) => (
          <div
            key={item.key}
            className="bg-blue-100 hover:bg-blue-200 cursor-pointer p-4 rounded shadow-md transition"
            onClick={() => navigate(item.path)}
          >
            <h3 className="text-lg font-semibold">{item.label}</h3>
            <p className="text-xl font-bold text-blue-800 mt-2">
              ₹{data?.[item.key]?.toLocaleString("en-IN") || "0.00"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountSummary;
