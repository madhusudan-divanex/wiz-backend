const mongoose = require("mongoose");

const ThoughtLeadershipSchema = new mongoose.Schema({
  imageUrl: String,
  tagLabel: { type: String, maxlength: 13 },
  contentLink: String,
});

const AdditionalSectionSchema = new mongoose.Schema({
  type: { type: String, enum: ["text", "gallery"], required: true },
  title: String,
  content: String,
  galleryImages: [String], // Array of image URLs
});

const MarketingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  experience: String,
  expertise: String,
  menu: String,
  videoIntro:String,
  additionalSections: {
    type: [AdditionalSectionSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3']
  },
  thoughtLeadershipPortfolio: [ThoughtLeadershipSchema],
});
function arrayLimit(val) {
  return val.length <= 3; // max 3 additional sections
}


module.exports = mongoose.model("provider-marketing", MarketingSchema);
