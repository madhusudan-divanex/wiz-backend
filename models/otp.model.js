const { Schema, default: mongoose } = require("mongoose");

const otpSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    code:Number
},{timestamps:true})
module.exports = mongoose.model('Otp', otpSchema);