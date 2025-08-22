import express from "express";
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

console.log("DEBUG check: MONGO_URI =", process.env.MONGO_URI);

import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Debug: print loaded environment variables (only keys, not secrets)
console.log("✅ Loaded environment variables:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "set" : "missing");
console.log("STREAM_API_KEY:", process.env.STREAM_API_KEY ? "set" : "missing");

// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// --- Routes ---
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// --- Serve frontend in production ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// --- Connect DB + Start Server ---
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
