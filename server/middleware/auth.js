const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const bearerHeader = req.header("Authorization");

  if (!bearerHeader || !bearerHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Access denied. No token provided." });

  const token = bearerHeader.split(" ")[1];

  try {
    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user from DB (important)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ error: "User not found" });

    // Attach to request
    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(400).json({ error: "Invalid token" });
  }
};
