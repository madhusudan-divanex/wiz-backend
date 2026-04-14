const mongoose = require('mongoose');

const ReferenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    workTogether: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
});



const FeaturesSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        name: { type: String, required: true },
        relationship: { type: String, required: true },
        workTogether: { type: String, required: true },
        contact: { type: String, required: true },
        status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('consumer-refferences', FeaturesSchema);
