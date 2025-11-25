const { Schema, default: mongoose } = require("mongoose");

const delSchema = new Schema(    {
    reason: String,
    email: String,
    firstName: String,
    lastName: String,
    contactNumber: String,
}, { timestamps: true })

module.exports = mongoose.model("delete-user", delSchema);