const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        accountName: { type: String, required: true },
        email: { type: String, required: true },
        detail: { type: String, required: true },
        spot: { type: String, required: true },
        contactNumber: { type: String, required: true },
        image: { type: String, required: true },
        startDate:{type:Date},
        endDate:{type:Date},
        amount: { type: Number },
        status:{type:String,enum:['requested','approve','live','expired','declined'],default:'requested'}
    },
    { timestamps: true }
);

module.exports = mongoose.model('provider-advertisement', adSchema);
