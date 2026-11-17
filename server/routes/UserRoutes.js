const express = require("express");
const router = express.Router();
const { Signup, Login, Logout, GetMe } = require("../controlers/UserController");
const authMiddleware = require("../middleware/auth");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/me", authMiddleware, GetMe);

module.exports = router;
