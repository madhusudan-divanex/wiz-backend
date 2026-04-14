const { Schema, default: mongoose } = require("mongoose");

const exclusiveMembershipsSchema = new Schema(
  {
    titleLeft: { type: String, required: true },
    titleHighlight: { type: String, required: false },
    titleRight: { type: String, required: true },
    subheading: { type: String, required: false },
    bullets: { type: [String], default: [] },
    image: { type: String },
    ctaText: { type: String },
    ctaLink: { type: String },
    scriptTitle: { type: String },
    scriptNote: { type: String },
    scriptCtaText: { type: String },
    scriptCtaLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("exclusive-memberships", exclusiveMembershipsSchema);
