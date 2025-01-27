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

    if (!label || !value || !image) {
      return res
        .status(400)
        .json({ message: "Label, value, and image are required." });
    }

    if (!image.includes(";base64,")) {
      return res.status(400).json({
        message: "Invalid image format. Image should have ';base64,' prefix.",
      });
    }

    const newCategory = new Category({
      label,
      value,
      image,
    });

    const result = await newCategory.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating category:", err);
    res
      .status(400)
      .json({ message: "Failed to create category.", error: err.message });
  }
};

exports.fetchCategoriesByID = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, value, image } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (label) category.label = label;
    if (value) category.value = value;
    if (image) {
      if (!image.includes(";base64,")) {
        return res.status(400).json({
          message: "Invalid image format. Image should have ';base64,' prefix.",
        });
      }
      category.image = image;
    }

    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error("Error updating category:", err);
    res
      .status(400)
      .json({ message: "Failed to update category.", error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    console.error("Error deleting category:", err);
    res
      .status(400)
      .json({ message: "Failed to delete category.", error: err.message });
  }
};
