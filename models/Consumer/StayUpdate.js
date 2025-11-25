const mongoose = require('mongoose');

const stayUpdatedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedService: { type: Boolean, default: false },
    promotions: { type: Boolean, default: false },
    offers: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports= mongoose.model("consumer-stayUpdate", stayUpdatedSchema);
