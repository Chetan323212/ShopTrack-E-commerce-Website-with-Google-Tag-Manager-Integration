import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (or authenticated)
export const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      shipping,
      tax,
      grandTotal,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ message: "Shipping address is incomplete" });
    }

    const uniqueOrderId =
      orderId || `AURA-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = new Order({
      orderId: uniqueOrderId,
      user: req.user ? req.user._id : undefined,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "Credit Card",
      subtotal: Number(subtotal),
      discount: Number(discount || 0),
      shipping: Number(shipping || 0),
      tax: Number(tax || 0),
      grandTotal: Number(grandTotal),
      isPaid: true,
      status: "Processing",
    });

    const createdOrder = await order.save();

    // If authenticated, clear user's cart
    if (req.user) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID or orderId string
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let order = await Order.findOne({ orderId: id });
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
