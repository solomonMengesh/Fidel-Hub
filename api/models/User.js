const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      default: "student",
    },
    cv: { type: String }, // URL to the CV document, applicable for instructors
    materials: { type: [String] }, // URLs to additional materials, applicable for instructors
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
