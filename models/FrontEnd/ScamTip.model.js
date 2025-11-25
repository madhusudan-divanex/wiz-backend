const { Schema, default: mongoose } = require("mongoose");

const tipSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    image:{type:String,required:false},
    link:{type:String,required:false},
    isFeatured:{type:Boolean},
    type:{type:String,enum:['book','youtube','instagram'],required:true}


},{timestamps:true});

module.exports=mongoose.model("ScamTip",tipSchema);