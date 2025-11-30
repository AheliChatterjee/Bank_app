// routes/fundRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getShareFund,
  postShareTransaction,

  getThriftFund,
  postThriftTransaction,

  createMtLoan,
  getMtLoanSummary,
  payMtLoanEmi,

  createOwnLoan,
  getOwnLoanSummary,
  payOwnLoanEmi
} = require("../controllers/fundController");


// ---------------- SHARE FUND ----------------
router.get("/share", auth, getShareFund);
router.post("/share", auth, postShareTransaction);

// ---------------- THRIFT FUND ----------------
router.get("/thrift", auth, getThriftFund);
router.post("/thrift", auth, postThriftTransaction);

// ---------------- MT LOAN ----------------
router.post("/mt/create", auth, createMtLoan);
router.get("/mt", auth, getMtLoanSummary);
router.post("/mt/:loanId/pay", auth, payMtLoanEmi);

// ---------------- OWN LOAN ----------------
router.post("/own/create", auth, createOwnLoan);
router.get("/own", auth, getOwnLoanSummary);
router.post("/own/:loanId/pay", auth, payOwnLoanEmi);

module.exports = router;
