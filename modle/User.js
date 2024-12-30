const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: Buffer },
    role: { type: String, required: true, default: "user" },
    addresses: { type: [Schema.Types.Mixed] },
    name: { type: String },
    salt: Buffer,
    phone: { type: String },
    accountId: { type: String },
    resetPasswordToken: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
    profileImage: { type: String, default: "" },
    verificationToken: { type: String, default: "" },
    verificationTokenExpires: { type: Date, default: Date.now },
    provider: { type: String, required: true, default: "local" },
  },
  { timestamps: true }
);

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports.User = mongoose.model("User", userSchema);
