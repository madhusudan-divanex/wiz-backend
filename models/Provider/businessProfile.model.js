const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    company: { type: String, required: true },
    website: { type: String, required: true },
    email: { type: String, required: true },
    contact:[String],
    officeAddress: { type: String, required: true },
    emirate : { type: String, required: true },
    postcode:{type:String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model('BusinessProfile', userSchema);
