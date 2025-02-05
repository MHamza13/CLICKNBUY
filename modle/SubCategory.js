const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchema = new Schema(
  {
    values: { type: String, required: true },
    categoryId: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

subCategorySchema.index({ values: 1, categoryId: 1 }, { unique: true });

const virtual = subCategorySchema.virtual("id");
virtual.get(function () {
  return this._id;
});

subCategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.SubCategory = mongoose.model("SubCategory", subCategorySchema);
