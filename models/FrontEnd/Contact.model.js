const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  whatsappLink: {
    type: String,
    default: ""
  },
  mobileFirst: {
    type: String,
    default: ""
  },
  mobileSecond: {
    type: String,
    default: ""
  },

  socialMedia: {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },

  address1: {
    type: String,
    default: ""
  },
  address2: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    default: ""
  },

}, { timestamps: true });

// Export Model
module.exports = mongoose.model("cms-contact", contactSchema);
