const { Schema, default: mongoose } = require("mongoose");

const membershipSchema=new Schema({
    membershipId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'membership',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    email:{
        type:String,
        // required:true
    },    
    country:{
        type:String,
        // required:true
    },
    zipCode:{
        type:String,
    },
    phoneNumber:{
        type:String
    },
    cardInformation:{
        cardHolderName:String,
        cardNumber:String,
        expiryDate:String,
        cvv:String
    },
    price:Number,
    startDate:Date,
    endDate:Date,
    status:{
        type:String,
        enum:['active','next','expired','cancel'],
        default:'active'
    }
},{timestamps:true})
module.exports = mongoose.model('buy-membership', membershipSchema);