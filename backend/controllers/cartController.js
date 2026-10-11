import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync / Update user's entire cart
// @route   POST /api/cart
// @access  Private
export const syncCart = async (req, res) => {
  try {
    const { items, promoCode, discountPercent } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    // Validate and build item array
    const formattedItems = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        // item can contain product id or product object
        const productId = item.product?._id || item.product?.id || item.product;
        const product = await Product.findOne({
          $or: [{ _id: productId }, { slug: productId }],
        });

        if (product) {
          formattedItems.push({
            product: product._id,
            quantity: Number(item.quantity) || 1,
            selectedColor: item.selectedColor || "",
            price: product.price,
          });
        }
      }
    }

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: formattedItems,
        promoCode: promoCode || "",
        discountPercent: Number(discountPercent) || 0,
      });
    } else {
      cart.items = formattedItems;
      cart.promoCode = promoCode || cart.promoCode;
      cart.discountPercent =
        discountPercent !== undefined ? Number(discountPercent) : cart.discountPercent;
    }

    const savedCart = await cart.save();
    const populatedCart = await Cart.findById(savedCart._id).populate("items.product");

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.promoCode = "";
      cart.discountPercent = 0;
      await cart.save();
    }
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
