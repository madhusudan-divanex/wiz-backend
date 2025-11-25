const mongoose = require('mongoose');

const businessLicenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    licenseUsedBy: {
        type: String,
        enum: ['Free Zone Licensed Business in UAE', 'Other'],
        required: true
    },
    licenseCurrentlyActive: { type: Boolean },
    licenses: [{
        tradeLicenseFile: { type: String, },
        tradeLicenseNumber: { type: String, },
        licenseExpiryDate: { type: Date },
        licenseIssueDate: { type: Date,},
        licenseIssuingBody: { type: String },
        licenseIssuedIn: { type: String },
        companyFormationType: { type: String },
        licenseProfessionalBody: String,
        licenseProfessionalCategory: String,
        licenseServicesUnder: { type: String },
        licenseInternationalOperation: { type: Boolean },
    }],

    // Common fields (not specific to individual licenses)
    isRegulatedByLaw: { type: Boolean },
    regulatedProfessions: String,
    regulatedBodies: String,
    regulatedCategory: String,

    hasCertificate: { type: Boolean, default: false },
    additionalCertificates: [
        {
            title: { type: String }
        }
    ],
    professionalServices: [
        {
            regulatedProfession: String,
            isActive: Boolean,
            displayOnProfile: Boolean,
        }
    ],

    termsAgreed: { type: Boolean, required: true },
    termsAgreedSecond:{type:Boolean,required:true},
    termsAgreedThird:{type:Boolean},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('provider-accreditation', businessLicenseSchema);