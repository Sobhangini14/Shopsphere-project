const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // REMOVE "Bearer " IF PRESENT
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const verified = jwt.verify(token, "secretkey123");

    req.user = verified;
    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;