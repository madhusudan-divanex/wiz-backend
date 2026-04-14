const mongoose = require('mongoose');

const serviceFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    intrestedServices: {
      type: [String],
      default: [],
    },
    usedServices: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports= mongoose.model("provider-service", serviceFormSchema);
