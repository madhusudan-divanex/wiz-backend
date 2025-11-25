const mongoose = require('mongoose');

const preferenceFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    passionateTopics: { type: String },
    podcastSubjects: { type: String },
    hobbies: { type: String },
    favoriteActivities: { type: String },
    infoPreference: { type: String },
    desiredFeatures: { type: String },
    expatChallenges: { type: String },
    improvementSuggestions: { type: String },
  },
  { timestamps: true }
);

module.exports= mongoose.model("consumer-preference", preferenceFormSchema);
