const { Schema, default: mongoose } = require("mongoose");

const feedbackSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message:String,

},{timestamps:true})

module.exports=mongoose.model('feedback',feedbackSchema)