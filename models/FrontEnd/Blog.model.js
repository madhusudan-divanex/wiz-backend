const { Schema, default: mongoose } = require("mongoose");

const tipSchema=new Schema({
    title:{type:String,required:true},
    link:{type:String,required:true},
    description:{type:String,required:true},
    image:{type:String,required:false},
    date:Date,
    viewCount:Number,
    catId: { type: mongoose.Schema.Types.ObjectId, ref: "blog-category", required: true },
},{timestamps:true});

module.exports=mongoose.model("Blog",tipSchema);