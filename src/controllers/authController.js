import jwt from "jsonwebtoken";
import Task from "../models/Task.js";
import User from "../models/Users.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

import validator from "validator";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // block empty or non-string inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({ message: "Invalid input types." });
    }

    const cleanName = validator.escape(validator.trim(name));
    const cleanEmail = validator.normalizeEmail(validator.trim(email));

    if (!validator.isLength(cleanName, { min: 2, max: 50 })) {
      return res
        .status(400)
        .json({ message: "Name must be between 2 and 50 characters." });
    }
    if (!validator.isAlpha(cleanName, "en-US", { ignore: " -'" })) {
      return res
        .status(400)
        .json({ message: "Name contains invalid characters." });
    }

    if (!cleanEmail || !validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    if (!validator.isLength(password, { min: 6, max: 128 })) {
      return res
        .status(400)
        .json({ message: "Password must be between 6 and 128 characters." });
    }
    if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0, 
      })
    ) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
    });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed.", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input types." });
    }

    const cleanEmail = validator.normalizeEmail(validator.trim(email));

    if (!cleanEmail || !validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    if (!validator.isLength(password, { min: 6, max: 128 })) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      message: "Account deleted and logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Logout failed.", error: error.message });
  }
};
