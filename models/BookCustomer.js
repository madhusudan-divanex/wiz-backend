const { Schema, default: mongoose } = require("mongoose");

const bookSchema=new Schema({
    email:String
},{timestamps:true})

module.exports= mongoose.model('book-customer',bookSchema)