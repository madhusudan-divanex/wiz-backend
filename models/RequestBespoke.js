const mongoose = require("mongoose");

const requestBespoke = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    firstName: {
      type: String,
      trim: true,
      required: true,
    },

    lastName: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    serviceLocation: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },

    contactNumber: {
      type: String,
      trim: true,
      required: true,
    },

    businessName: {
      type: String,
      trim: true,
      required: false,
    },

    businessCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    serviceActivity: {
      type: String,
      trim: true,
      required: false,
    },

    priceRange: {
      type: Number,
      default: null,
    },

    serviceDate: {
      type: Date,
      default: null,
    },

    specificRequirement: {
      type: String,
      trim: true,
      default: "",
    },

    preferenceToAvoid: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ['concierge-service', 'customize-service'],
      default: 'concierge-service'
    },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("request-bespoke", requestBespoke);
