const { Schema, default: mongoose } = require("mongoose");

const subscriberSchema=new Schema({
    email:String,
},{timestamps:true})

module.exports=mongoose.model('newsletter',subscriberSchema)