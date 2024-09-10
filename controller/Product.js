const { Product } = require("../modle/Product");
const { Image } = require("../modle/Image");

exports.createProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { products } = req.body; // Extract products from request body

    console.log("PRODUCTS:", products);

    if (!products || typeof products !== "object") {
      return res
        .status(400)
        .json({ message: "Product data is required and must be an object." });
    }

    // Check if required fields are present
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

    // Process image data if available
    const imageFields = ["thumbnail", "image1", "image2", "image3"];
    const imageResults = [];
    for (const field of imageFields) {
      const img = products[field];
      if (img && img.includes(";base64,")) {
        const base64Data = img.split(";base64,").pop();
        const mimeType = img.split(";")[0].split(":")[1];
        const imageBuffer = Buffer.from(base64Data, "base64");

        // Create an image instance and save it
        const image = new Image({
          data: imageBuffer,
          contentType: mimeType,
        });

        const savedImage = await image.save();
        imageResults.push(savedImage._id);
      } else if (img) {
        console.error(`Invalid image data format for ${field}:`, img);
      }
    }

    // Create and save the product with image references
    let product = new Product({
      ...products,
      images: imageResults, // Save the image IDs
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
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const doc = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(doc);
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
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
