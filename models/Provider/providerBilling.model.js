const { Schema, default: mongoose } = require("mongoose");

const billSchema=new Schema({
    detail:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

},{timestamps:true})

module.exports=mongoose.model('provider-billing',billSchema)