const { Schema, default: mongoose } = require("mongoose");

const notificatonSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    message:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        default:'green'
    }
},{timestamps:true})

module.exports=mongoose.model('notification',notificatonSchema)