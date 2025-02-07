const Attribute = require("../modle/Attribute");

// Craete Attributes

exports.createAttribute = async (req, res) => {
  try {
    const { name, type, options } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and Type are required" });
    }

    let processedOptions = [];
    if (type === "select") {
      if (Array.isArray(options)) {
        processedOptions = options;
      } else if (typeof options === "string") {
        processedOptions = options
          .split(",")
          .map((option) => option.trim())
          .filter((option) => option);
      } else {
        return res.status(400).json({
          message: "Options should be a string or an array for 'select' type",
        });
      }
    }

    const attribute = new Attribute({
      name,
      type,
      options: processedOptions,
    });

    await attribute.save();

    return res.status(201).json({
      message: "Attribute created successfully",
      data: attribute,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create attribute",
      error: error.message,
    });
  }
};

// Get all Attributes
exports.getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find();
    return res
      .status(200)
      .json({ message: "Attributes retrieved successfully", data: attributes });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve attributes", error: error.message });
  }
};

// Get an Attribute by ID
exports.getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found" });
    }
    return res
      .status(200)
      .json({ message: "Attribute retrieved successfully", data: attribute });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve attribute", error: error.message });
  }
};

// Update an Attribute by ID
exports.updateAttribute = async (req, res) => {
  try {
    const updatedAttribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!updatedAttribute) {
      return res.status(404).json({ message: "Attribute not found" });
    }

    return res.status(200).json({
      message: "Attribute updated successfully",
      data: updatedAttribute,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update attribute", error: error.message });
  }
};

// Delete an Attribute by ID
exports.deleteAttribute = async (req, res) => {
  try {
    const deletedAttribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!deletedAttribute) {
      return res.status(404).json({ message: "Attribute not found" });
    }
    return res.status(200).json({ message: "Attribute deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to delete attribute", error: error.message });
  }
};
