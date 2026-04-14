const { Schema, default: mongoose } = require("mongoose");

const homeBannerSchema = new Schema(
  {
    smallTitle: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    buttonName: { type: String, required: false },
    buttonLink: { type: String, required: false },
    image: { type: String, required: false },
    footerText: { type: String, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("home-banner", homeBannerSchema);
