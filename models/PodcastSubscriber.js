const { Schema, default: mongoose } = require("mongoose");

const subscriberSchema=new Schema({
    name:String,
    email:String,
    country:String
},{timestamps:true})

module.exports=mongoose.model('podcast-subscriber',subscriberSchema)