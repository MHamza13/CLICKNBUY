const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [1, "Price must be at least 1"],
    max: [10000, "Price must not exceed 10000"],
    required: true,
  },
  discountPercentage: {
    type: Number,
    min: [0, "Discount Percentage must be at least 0"],
    max: [100, "Discount Percentage must not exceed 100"],
    default: 0,
  },
  rating: {
    type: Number,
    min: [0, "Rating must be at least 0"],
    max: [5, "Rating must not exceed 5"],
    default: 0,
  },
  stock: {
    type: Number,
    min: [0, "Stock must be at least 0"],
    default: 0,
  },
  status: {
    type: String,
    default: "Active",
  },
  newarrivedproduct: {
    type: String,
    default: "Inactive",
  },
  trendingproduct: {
    type: String,
    default: "Inactive",
  },
  featuredproduct: {
    type: String,
    default: "Inactive",
  },
  weight: {
    type: Number,
    default: 0,
  },
  weightType: {
    type: String,
    default: "ml",
  },
  brand: { type: String, required: true },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  subcategories: [
    {
      type: String,
      default: ["UnSubCategorized"],
    },
  ],
  colors: { type: [mongoose.Schema.Types.Mixed] },
  sizes: { type: [mongoose.Schema.Types.Mixed] },
  thumbnail: { type: String, required: true },
  highlights: { type: [String] },
  images: [{ type: mongoose.Schema.Types.String, ref: "Image" }],
  discountedPrice: { type: Number },
  deleted: { type: Boolean, default: false },
});

productSchema.virtual("id").get(
  function () {
    return this._id.toHexString();
  },
  { timestamps: true }
);

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Product = mongoose.model("Product", productSchema);
