import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/users", protect, adminOnly, getAllUsers);

export default router;
