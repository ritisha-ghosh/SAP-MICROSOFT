const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Invalid or expired token" })
  }
}
