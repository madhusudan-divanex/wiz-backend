const mongoose = require('mongoose');

const profileFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    dob: { type: Date },
    nationality: { type: String },
    age: { type: String },
    gender: { type: String },
    profileImage:String,
  },
  { timestamps: true }
);

module.exports= mongoose.model("consumer-profile", profileFormSchema);
