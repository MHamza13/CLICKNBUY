const Rating = require("../modle/Ratting");

// ✅ Create Rating
exports.createRating = async (req, res) => {
  try {
    const { productId, userId, name, email, rating, comment } = req.body;

    if (!productId || !userId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRating = new Rating({ productId, userId, name, email, rating, comment });
    await newRating.save();

    await newRating.populate(["userId", "productId"]);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: "Error creating rating", error });
  }
};

// ✅ Get All Ratings 
exports.getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("userId") 
      .populate("productId", "title price");

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
};

// ✅ Get Single Rating by ID 
exports.getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate("userId")
      .populate("productId", "title price");

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rating", error });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const updatedRating = await Rating.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("userId") 
      .populate("productId", "title price");

    if (!updatedRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json(updatedRating);
  } catch (error) {
    res.status(500).json({ message: "Error updating rating", error });
  }
};

// ✅ Delete Rating
exports.deleteRating = async (req, res) => {
  try {
    const deletedRating = await Rating.findByIdAndDelete(req.params.id);

    if (!deletedRating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rating", error });
  }
};
