const { Brand } = require("../modle/Brand");

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrand = async (req, res) => {
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
    // mens-shirts

    const newBrand = new Brand({
      label,
      value,
      image,
    });

    const result = await newBrand.save();
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating category:", err);
    res
      .status(400)
      .json({ message: "Failed to create category.", error: err.message });
  }
};

exports.fetchBrandsUserId = async (req, res) => {
  const { id } = req.user;

  try {
    const brand = await Brand.find({ userId: id });
    const totalBrand = await Brand.countDocuments();

    res.set("X-Total-Count", totalBrand);
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.fetchBrandsByID = async (req, res) => {
  const { id } = req.params;

  try {
    const brands = await Brand.findById(id);

    if (!brands) {
      return res.status(404).json({ message: "brand not found." });
    }

    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brand by ID:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.updateBrands = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, value, image } = req.body;

    const brands = await Brand.findById(id);

    if (!brands) {
      return res.status(404).json({ message: "brand not found." });
    }

    if (label) brands.label = label;
    if (value) brands.value = value;
    if (image) {
      if (!image.includes(";base64,")) {
        return res.status(400).json({
          message: "Invalid image format. Image should have ';base64,' prefix.",
        });
      }
      brands.image = image;
    }

    const updatedbrands = await brands.save();

    res.status(200).json(updatedbrands);
  } catch (err) {
    console.error("Error updating brand:", err);
    res
      .status(400)
      .json({ message: "Failed to update brand.", error: err.message });
  }
};

exports.deletebrands = async (req, res) => {
  try {
    const { id } = req.params;

    const brands = await Brand.findByIdAndDelete(id);

    if (!brands) {
      return res.status(404).json({ message: "brand not found." });
    }

    res.status(200).json({ message: "brand deleted successfully." });
  } catch (err) {
    console.error("Error deleting brand:", err);
    res
      .status(400)
      .json({ message: "Failed to delete brand.", error: err.message });
  }
};