import express from "express";
import { login, logout, signup } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", protect, logout);

export default router;
