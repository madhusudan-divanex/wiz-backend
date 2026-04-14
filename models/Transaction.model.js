const { Schema, default: mongoose } = require("mongoose");

const transactionSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    customId:String,
    email:{
        type:String
    },    
    country:{
        type:String
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
    disputeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'open-dispute'
    },
    bespokeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'request-bespoke'
    },
    buyMembershipId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'buy-membership'
    },
    type:{type:String,enum:['membership','dispute','bespoke']},
    amount:Number

},{timestamps:true})
transactionSchema.pre("save", async function (next) {
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

module.exports=mongoose.model('transaction',transactionSchema)