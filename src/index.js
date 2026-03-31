import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDatabase from "./utils/db.js";
import taskRoutes from "./routes/tasks.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 70,
  message: { message: "Too many requests. Please try again later." },
});

app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  message: { message: "Too many attempts. Please try again later." },
});

app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

connectDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
