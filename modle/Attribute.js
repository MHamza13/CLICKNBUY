const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["text", "number", "select"],
      required: true,
    },
    options: {
      type: [String],
      required: function () {
        return this.type === "select";
      },
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

attributeSchema.virtual("id").get(function () {
  return this._id;
});

attributeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Attribute = mongoose.model("Attribute", attributeSchema);

module.exports = Attribute;
