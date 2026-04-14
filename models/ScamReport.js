const { Schema, default: mongoose } = require("mongoose");

const reportSchema=new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    title:String,
    description:String,
    dateReported:Date,
    format:String,
    scamType:{
        type: mongoose.Schema.Types.ObjectId, ref: "ScamType",
        required:true
    },
    serviceCategory:{
        type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory",
        required:true
    },
    amountOfLost:String,
    name:String,
    reportToAuthoritise:Boolean,
    reportedToWhom:String,
    severity :Number,
    image:String,
    status:{type:String,enum:['pending','live','declined'],default:'pending'}

},{timestamps:true})
module.exports=mongoose.model('scam-report',reportSchema)