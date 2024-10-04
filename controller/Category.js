const { Category } = require("../modle/Category");
const { User } = require("../modle/User");

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    delete User.password;
    delete User.salt;
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { label, value, image } = req.body;

    // Validate category fields
    if (!label || !value || !image) {
      return res
        .status(400)
        .json({ message: "Label, value, and image are required." });
    }

    // Validate base64 image format
    if (!image.includes(";base64,")) {
      return res.status(400).json({
        message: "Invalid image format. Image should have ';base64,' prefix.",
      });
    }

    // Create new category
    const newCategory = new Category({
      label,
      value,
      image,
    });

    // Save the new category
    const result = await newCategory.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating category:", err);
    res
      .status(400)
      .json({ message: "Failed to create category.", error: err.message });
  }
};
