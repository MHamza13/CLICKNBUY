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
