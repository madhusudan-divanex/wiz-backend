const mongoose = require('mongoose');;

const basketFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: String, required: true },
    area: { type: String, required: true },
    emirate: { type: String, required: true },
    phone: { type: String, required: true },
    receiveGiftBox: { type: Boolean, default: false },
    expatStatus: { type: String },
  },
  { timestamps: true }
);

module.exports= mongoose.model("consumer-basket", basketFormSchema);
