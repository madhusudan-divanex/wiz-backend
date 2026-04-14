const mongoose = require('mongoose');

const ReferenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    workTogether: { type: String, required: true },
    contact: { type: String, required: true },
});

const FeaturesSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        recommendations: { type: Boolean, default: false },
        referenceProgram: { type: Boolean, default: false },
        references: {
            type: [ReferenceSchema]
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Features', FeaturesSchema);
