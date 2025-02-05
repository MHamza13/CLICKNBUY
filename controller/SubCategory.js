const { SubCategory } = require("../modle/SubCategory");
const { Category } = require("../modle/Category");

exports.addSubCategory = async (req, res) => {
  const { values, categoryId } = req.body;

  if (!values || !categoryId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const existingSubCategory = await SubCategory.findOne({
      values,
      categoryId,
    });

    if (existingSubCategory) {
      return res.status(400).json({
        message:
          "Subcategory with this value already exists under this category.",
      });
    }

    const subCategory = new SubCategory({
      values,
      categoryId,
    });

    await subCategory.save();

    return res.status(201).json({
      values: subCategory.values,
      categoryId: subCategory.categoryId,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return res
      .status(500)
      .json({ message: "Error creating subcategory.", error: error.message });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate(
      "categoryId",
      "values"
    );
    const totalSubCategory = await SubCategory.countDocuments();

    res.set("X-Total-Count", totalSubCategory);

    return res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return res
      .status(500)
      .json({ message: "Error fetching subcategories.", error: error.message });
  }
};

exports.getSubCategoriesById = async (req, res) => {
  const { id } = req.params;

  try {
    const subCategories = await SubCategory.find({ _id: id }).populate(
      "categoryId",
      "values"
    );

    if (!subCategories || subCategories.length === 0) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    return res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return res
      .status(500)
      .json({ message: "Error fetching subcategories.", error: error.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const { values } = req.body;

  if (!values) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }

    if (subCategory.values !== values) {
      const existingSubCategory = await SubCategory.findOne({ values });

      if (existingSubCategory) {
        return res.status(400).json({
          message:
            "Subcategory with this value already exists under this category.",
        });
      }
    }

    subCategory.values = values;

    await subCategory.save();

    return res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return res
      .status(500)
      .json({ message: "Error updating subcategory.", error: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
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
