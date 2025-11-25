const mongoose = require("mongoose");

const BusinessSurveySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        keyChallenges: {
            type: String,
            required: false,
        },

        supportNeededArea1: {
            type: String,
            required: false,
        },


        visionForFuture: {
            type: String,
            required: false,
        },

        disputeManagement: {
            type: String,
            required: false,
        },

        marketingStrategy: {
            type: String,
            required: false,
        },

        businessPodcastTopics: {
            type: String, // Or [String] if you want array
            required: false,
        },

        // Follow-Up Questions
        improveExperience: {
            type: String,
            required: false,
        },

        preferredCommunication: {
            type: String,
            required: false,
        },

        platformFeatures: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("provider-business-preference", BusinessSurveySchema);
