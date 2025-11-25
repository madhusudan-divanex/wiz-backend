const { Schema, default: mongoose } = require("mongoose");

const bookmarkSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    bookmarkUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // required:true
    },
    trackerBookmark:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'scam-report',
    }

},{timestamps:true})

module.exports=mongoose.model('bookmark',bookmarkSchema)