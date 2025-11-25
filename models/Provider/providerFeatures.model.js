const mongoose = require('mongoose');

const ReferenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    workTogether: { type: String, required: true },
    contact: { type: String, required: true },
});

const ConnectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { 
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { _id: false });

const FeaturesSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        recommendations: { type: Boolean, default: false },
        referenceProgram: { type: Boolean, default: false },

        connection: {
            type: [ConnectionSchema],
            default: []
        },

        chatShow: { type: Boolean, default: false },

        references: {
            type: [ReferenceSchema],
            default: []
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('provider-features', FeaturesSchema);
