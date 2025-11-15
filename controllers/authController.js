const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, role, username) => {
  return jwt.sign({ id, role, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    // Validation
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).render("register", { message: "All fields are required" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).render("register", { message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("register", { message: "Email already exists" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    if (email == "admin@task.com" && password == "admin12345") {
      const user = await User.create({
        username,
        email,
        role: "admin",
        password: hashedPassword,
      });

    } else {
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
    }


    // Generate Token
    const token = generateToken(user._id, user.role);

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).redirect("/");
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).render("register", { message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Validation
    if (!email || !password) {
      return res.status(400).render("login", { message: "Please enter both email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).render("login", { message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render("login", { message: "Invalid credentials" });
    }

    // Generate Token
    const token = generateToken(user._id, user.role, user.username);

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).redirect("/");
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).render("login", { message: "Server error during login" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).redirect("/");
};

module.exports = { registerUser, loginUser, logout };
