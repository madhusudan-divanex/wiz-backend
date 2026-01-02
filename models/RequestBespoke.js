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
      minPrice: { type: Number, default: 0 },
      maxPrice: { type: Number, default: 0 },
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
    addOnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'addon-services',
      required: true
    },
    addOnType: {
      type: String
    },
    addOnPrice: {
      type: Number
    },
    type: {
      type: String,
      enum: ['concierge-service', 'customize-service'],
      default: 'concierge-service'
    },
    country: {
      type: String
    },
    paymentEmail: {
      type: String
    },
    zipCode: {
      type: String,
    },
    phoneNumber: {
      type: String
    },
    cardInformation: {
      cardHolderName: String,
      cardNumber: String,
      expiryDate: String,
      cvv: String
    },
    serviceUsed:{type:Boolean,default:false},
    tokenUsed:{type:Boolean,default:false},
    providerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
    status: { type: String, enum: ['payment-pending', 'pending', 'completed','approved','rejected'], default: 'payment-pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("request-bespoke", requestBespoke);
