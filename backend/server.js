import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./seeder.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// System health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AURA E-Commerce REST API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Mount modular REST API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// In production, serve static assets from frontend build
const frontendDist = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

// SPA fallback for client-side routing
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) next();
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Connect DB & Launch Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n\x1b[35m⚡ AURA Express Backend listening on port http://localhost:${PORT}\x1b[0m`);
      console.log(`   API Health: http://localhost:${PORT}/api/health`);
      console.log(`   Products:   http://localhost:${PORT}/api/products`);
      console.log(`   Auth:       http://localhost:${PORT}/api/auth/login\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
