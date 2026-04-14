const { Schema, default: mongoose } = require("mongoose");

const refSchema=new Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    referenceUser:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status:{type:String,enum:['pending','approved','cancel'],default:'pending'},
    comment:{type:String}
},{timestamps:true})

module.exports=mongoose.model('provider-reference',refSchema)