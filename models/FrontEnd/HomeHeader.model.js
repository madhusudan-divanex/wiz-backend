const { Schema, default: mongoose } = require("mongoose");

const findResourcesSchema = new Schema(
  {
    title: { type: String, required: true },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("home-header", findResourcesSchema);

