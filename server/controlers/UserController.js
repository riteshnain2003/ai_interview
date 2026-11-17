const Auth = require("../modals/UserModel");
const hasher = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const usercheck = await Auth.findOne({ email: normalizedEmail });
    if (usercheck) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email!",
      });
    }

    // Hash the password
    const hashedpassword = await hasher.hash(password, 10);

    const newUser = await Auth.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedpassword,
    });

    const payload = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "3d" });

    // Set cookie (secure: false in non-production to allow local HTTP testing)
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("authtoken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "Strict" : "Lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await Auth.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await hasher.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "3d" });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("authtoken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "Strict" : "Lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Error during login",
      error: err.message,
    });
  }
};

exports.Logout = async (req, res) => {
  try {
    res.clearCookie("authtoken");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};

exports.GetMe = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};
