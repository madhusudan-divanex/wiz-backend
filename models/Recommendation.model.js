const { Schema, default: mongoose } = require("mongoose");

const recommendationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recommendedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps:true})

module.exports=mongoose.model('recommendation',recommendationSchema)