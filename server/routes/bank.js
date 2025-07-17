const express = require("express");
const router = express.Router();
const {
  getAccountDetails,
  createAccount,
  getDashboardSummary,
  getFundHistory,
} = require("../controllers/bankController");

// Middleware to protect routes
const authMiddleware = require("../middleware/auth");

// All routes require authentication
router.use(authMiddleware);

// Get the logged-in user's account details
router.get("/account", getAccountDetails);

// Create a new bank account for the logged-in user
router.post("/account", createAccount);

// Get dashboard summary (balance, FDs, RDs, loans, recent transactions)
router.get("/dashboard", getDashboardSummary);

router.get("/fund/:type", getFundHistory);


module.exports = router;
