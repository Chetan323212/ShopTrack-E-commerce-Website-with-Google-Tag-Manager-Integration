import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price must be positive"],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      default: 15,
      min: 0,
    },
    badge: {
      type: String,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    features: {
      type: [String],
      default: [],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    colors: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Search indexes for rapid text search
productSchema.index({ name: "text", description: "text", tags: "text", brand: "text" });

export const Product = mongoose.model("Product", productSchema);
