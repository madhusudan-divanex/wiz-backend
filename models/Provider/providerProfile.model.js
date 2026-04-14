const { Schema, default: mongoose } = require("mongoose");

const CategorySchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    service: [{ type: mongoose.Schema.Types.ObjectId, ref: 'sub-category', required: true }]
});

const profileSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    title: String,
    company: String,
    location: String,
    avatar: String,
    idealClientProfile: String,
    bannerImage: String,
    isDefaultBanner:Boolean,
    profileImage: String,
    videoIntro: String,
    categories: [CategorySchema],
    type:{
        type:String,
        enum:['individual','company','restaurant'],
        required:true
    }
}, { timestamps: true })
module.exports = mongoose.model('provider-profile', profileSchema)