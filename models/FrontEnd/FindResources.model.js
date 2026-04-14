const { Schema, default: mongoose } = require("mongoose");

const findResourcesSchema = new Schema(
  {
    titleLeft: { type: String, required: true },
    titleHighlight: { type: String, required: false },
    titleRight: { type: String, required: true },
    subheading: { type: String, required: false },
    bullets: { type: [String], required: true, default: [] },
    note: { type: String, required: false },
    ctaText: { type: String, required: false },
    ctaLink: { type: String, required: false },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("find-resources", findResourcesSchema);

