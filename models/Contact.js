const { Schema, default: mongoose } = require("mongoose");

const contactSchema=new Schema({
    firstName:String,
    lastName:String,
    email:String,
    contact:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message:String,
    type:{type:String,enum:['contact','concern','get-in-touch'],default:"contact"}

},{timestamps:true})

module.exports=mongoose.model('contact',contactSchema)