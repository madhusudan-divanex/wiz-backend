const { Schema, default: mongoose } = require("mongoose");

const profileSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    viewUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})
module.exports = mongoose.model('profile-view', profileSchema);