const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    dobMonth: { type: String, required: true },
    dobDay: { type: String, required: true },
    age:{type:String},    
    visaStatus: String,
    nationality: String,  
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model('IndividualProfile', userSchema);
