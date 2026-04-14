const { Schema, default: mongoose } = require("mongoose");

const disputeSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    addOnId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'addon-services',
        required:true
    },
    addOnType:{
        type:String,
        required:true
    },
    addOnPrice:{
        type:Number,
        required:true
    },
    against:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String
    },
    image:{
        type:String
    },
    
    serviceUsed:{type:Boolean,default:false},
    tokenUsed:{type:Boolean,default:false},
    status:{type:String,enum:['payment-pending','pending','resolved','rejected'],default:'payment-pending'},
    resolution:String,
    customId:String,
    transactionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transaction'
    },
},{timestamps:true})
disputeSchema.pre("save", async function (next) {
  if (this.customId) return next();

  try {
    while (true) {
      const id = Math.floor(100000 + Math.random() * 900000).toString();
      const exists = await this.constructor.findOne({ customId: id });
      if (!exists) {
        this.customId = id;
        break;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});
module.exports=mongoose.model('open-dispute',disputeSchema)