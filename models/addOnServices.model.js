const { default: mongoose, Schema } = require("mongoose");

const addOnSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:Number,
    type:String,
},{timestamps:true})

module.exports=mongoose.model('addon-services',addOnSchema)