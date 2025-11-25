const { Schema, default: mongoose } = require("mongoose");

const chatSchema=new Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{type:String},
    chatImg:String
},{timestamps:true})
module.exports=mongoose.model('chat',chatSchema)