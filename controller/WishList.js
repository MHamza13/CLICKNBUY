const WishList = require("../modle/WishList");

// Fetch Wishlist by User ID
exports.fetchWishlistByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const wishListItems = await WishList.find({ user: id }).populate("product");
    res.status(200).json(wishListItems);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  const { id } = req.user;

  try {
    const newWishListItem = new WishList({ ...req.body, user: id });
    const savedItem = await newWishListItem.save();
    const result = await savedItem.populate("product");
    
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete from Wishlist (by Wishlist Item ID)
exports.deleteFromWishlist = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await WishList.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found or unauthorized" });
    }

    res.status(200).json({ message: "Item removed from wishlist", deletedItem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
