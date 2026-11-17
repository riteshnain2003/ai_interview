const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.authorization) {
      token = req.headers.authorization;
    } else if (req.cookies && req.cookies.authtoken) {
      token = req.cookies.authtoken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication token missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
