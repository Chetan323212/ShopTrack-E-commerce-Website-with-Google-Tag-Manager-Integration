import { Product } from "../models/Product.js";

// @desc    Fetch all products with filtering, search & sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, inStock } = req.query;

    const query = {};

    // 1. Category Filter
    if (category && category !== "all") {
      query.category = category;
    }

    // 2. Search Query (Matches name, brand, description, or tags)
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    // 3. Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. In Stock Filter
    if (inStock === "true") {
      query.inStock = true;
    }

    // 5. Sorting
    let sortOptions = { isFeatured: -1, createdAt: -1 };
    if (sort === "price-low" || sort === "price-asc") {
      sortOptions = { price: 1 };
    } else if (sort === "price-high" || sort === "price-desc") {
      sortOptions = { price: -1 };
    } else if (sort === "rating") {
      sortOptions = { rating: -1 };
    } else if (sort === "name") {
      sortOptions = { name: 1 };
    }

    const products = await Product.find(query).sort(sortOptions);

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by slug or ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check by slug first, then fallback to mongoose ObjectId if valid
    let product = await Product.findOne({ slug: id });

    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      brand,
      category,
      price,
      originalPrice,
      description,
      images,
      stockCount,
      badge,
      isFeatured,
      colors,
      features,
      specs,
      tags,
    } = req.body;

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const existingProduct = await Product.findOne({ slug: generatedSlug });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with this slug/name already exists" });
    }

    const product = new Product({
      name,
      slug: generatedSlug,
      brand: brand || "Aura Originals",
      category: category || "Accessories",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description,
      images: Array.isArray(images) ? images : [images],
      stockCount: stockCount ? Number(stockCount) : 10,
      inStock: (stockCount || 10) > 0,
      badge: badge || "",
      isFeatured: Boolean(isFeatured),
      colors: colors || [],
      features: features || [],
      specs: specs || {},
      tags: tags || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await Product.findOne({ slug: id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found to update" });
    }

    // Update attributes
    const updatableFields = [
      "name",
      "brand",
      "category",
      "price",
      "originalPrice",
      "description",
      "images",
      "stockCount",
      "badge",
      "isFeatured",
      "colors",
      "features",
      "specs",
      "tags",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.stockCount !== undefined) {
      product.inStock = Number(req.body.stockCount) > 0;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await Product.findOne({ slug: id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found to delete" });
    }

    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product deleted successfully", id: product._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
