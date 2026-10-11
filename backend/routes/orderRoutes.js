import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order can be called by guests or authenticated users
router.route("/").post((req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, () => createOrder(req, res, next));
  }
  return createOrder(req, res, next);
});

router.route("/").get(protect, adminOnly, getAllOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(getOrderById);

export default router;
