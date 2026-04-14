const { Schema, default: mongoose } = require("mongoose");

const feedSchema=new Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    feedbackUser:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating:{type:Number,required:true},
    title:{type:String,required:true},
    feedback:{type:String,required:true},
},{timestamps:true})

module.exports=mongoose.model('provider-feedback',feedSchema)