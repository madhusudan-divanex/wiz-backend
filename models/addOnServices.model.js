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
    addonType:{type:String,enum:['bespoke','customized ','dispute'],unique:true}
},{timestamps:true})

module.exports=mongoose.model('addon-services',addOnSchema)