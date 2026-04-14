const { Schema, default: mongoose } = require("mongoose");

const micSchmea=new Schema({
    name:String,
    email:String,
    topic:String,
    message:String
},{timestamps:true})
module.exports=mongoose.model('share-mic',micSchmea)