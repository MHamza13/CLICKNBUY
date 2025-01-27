const { Product } = require("../modle/Product");

exports.Getproducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function generateImageUrl(base64Image) {
  return base64Image;
}

exports.createProduct = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || typeof products !== "object") {
      return res
        .status(400)
        .json({ message: "Product data is required and must be an object." });
    }

    const requiredFields = [
      "title",
      "description",
      "price",
      "brand",
      "category",
      "thumbnail",
    ];
    for (const field of requiredFields) {
      if (!products[field]) {
        return res.status(400).json({ message: `Field ${field} is required.` });
      }
    }

    const imageResults = [];
    if (Array.isArray(products.images)) {
      for (const base64Image of products.images) {
        if (base64Image.includes(";base64,")) {
          const imageUrl = await generateImageUrl(base64Image);
          imageResults.push(imageUrl);
        } else {
          console.error("Invalid base64 format for image:", base64Image);
        }
      }
    }

    const discountedPrice = Math.round(
      products.price * (1 - (products.discountPercentage || 0) / 100)
    );

    let product = new Product({
      ...products,
      images: imageResults,
      discountedPrice,
    });

    let result = await product.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating product:", err);
    res
      .status(400)
      .json({ message: "Failed to create product.", error: err.message });
  }
};

exports.fetchAllProduct = async (req, res) => {
  let condition = {};

  // Exclude deleted products if not admin
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  // Initialize query with condition
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  // Apply category filter if provided
  if (req.query.category) {
    const categories = req.query.category.split(",");
    query = query.where("category").in(categories);
    totalProductsQuery = totalProductsQuery.where("category").in(categories);
  }

  // Apply brand filter if provided
  if (req.query.brand) {
    const brands = req.query.brand.split(",");
    query = query.where("brand").in(brands);
    totalProductsQuery = totalProductsQuery.where("brand").in(brands);
  }

  // Apply sorting if provided
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Pagination
  const totalDocs = await totalProductsQuery.countDocuments().exec();
  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit, 10);
    const page = parseInt(req.query._page, 10);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const products = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.deleted = req.body.deleted !== undefined ? req.body.deleted : false;

    Object.assign(product, req.body);

    product.discountedPrice = Math.round(
      product.price * (1 - (product.discountPercentage || 0) / 100)
    );

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res
      .status(400)
      .json({ message: "Failed to update product", error: err.message });
  }
};
