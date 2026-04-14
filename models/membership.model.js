const { default: mongoose, Schema } = require("mongoose");

const memberShipSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        monthly:Number,
        yearly:Number
    },
    features:[{
        title:String,
        detail:String
    }],
    btnText:{
        type:String,
        required:true
    },
    topChoice:{
        type:Boolean,
        default:false
    },
    type:{
        type:String,
        enum:['consumer','provider'],
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('membership',memberShipSchema)