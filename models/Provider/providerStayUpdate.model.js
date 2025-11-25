const mongoose = require('mongoose');

const stayUpdatedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceProvider: { type: Boolean, default: false },
    disputeResolution: { type: Boolean, default: false },
    verifiedReferences: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports= mongoose.model("provider-stayUpdate", stayUpdatedSchema);
