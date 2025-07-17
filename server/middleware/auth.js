const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
const bearerHeader = req.header("Authorization");
  const token = bearerHeader && bearerHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};
