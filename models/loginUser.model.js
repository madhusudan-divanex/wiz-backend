const { Schema, default: mongoose } = require("mongoose");

const loginSchema=new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},{timestamps:true})

module.exports=mongoose.model('login',loginSchema)