const { Schema, default: mongoose } = require("mongoose");

const counterSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const marketGlanceSchema = new Schema(
  {
    title: { type: String, required: true },
    counters: { type: [counterSchema], default: [] },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("market-glance", marketGlanceSchema);
