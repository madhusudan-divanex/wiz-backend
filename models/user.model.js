const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['pending', 'live', 'block', 'draft', 'cdraft', 'tdraft', ""], default: '' },
    role: { type: String, enum: ['consumer', 'provider'], required: true },
    approvedOn: Date,
    publishedOn: Date,
    freeService:{type:Number,default:0},
    onBoarding: { type: Boolean, default: false },
    referedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
