const BusinessLicense = require('../models/businessLicense.model');

exports.createBusinessLicense = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            licenses,
            professionalServices,
            additionalCertificates,
            regulatedProfessions,
            ...otherData
        } = req.body;

        // Parse licenses if provided as string
        let parsedLicenses = [];
        if (licenses) {
            try {
                parsedLicenses = typeof licenses === 'string'
                    ? JSON.parse(licenses)
                    : licenses;
            } catch (err) {
                console.error("Error parsing licenses:", err);
                return res.status(400).json({
                    success: false,
                    message: "Invalid licenses format"
                });
            }
        }

        // Process license files
       const licenseFiles = {};
        if (req.files && Array.isArray(req.files)) {
          req.files.forEach(file => {
            if (file.fieldname.startsWith('tradeLicenseFile_')) {
               const index = file.fieldname.split('_')[1];
               licenseFiles[index] = `/uploads/general/${file.filename}`;
             }
           });
         }

        // Add file paths to licenses
        parsedLicenses = parsedLicenses.map((license, index) => ({
            ...license,
            tradeLicenseFile: licenseFiles[index] || license.tradeLicenseFile || null
        }));

        // Parse professional services if provided
        let parsedProfessionalServices = [];
        if (professionalServices) {
            try {
                parsedProfessionalServices = typeof professionalServices === 'string'
                    ? JSON.parse(professionalServices)
                    : professionalServices;
            } catch (err) {
                console.error("Error parsing professionalServices:", err);
            }
        }

        // Parse certificate titles
        let parsedCertificates = [];
        if (additionalCertificates) {
            try {
                parsedCertificates = typeof additionalCertificates === 'string'
                    ? JSON.parse(additionalCertificates)
                    : additionalCertificates;
            } catch (err) {
                console.error("Error parsing additionalCertificates:", err);
                // Fallback: try to handle as array of strings
                parsedCertificates = Array.isArray(additionalCertificates)
                    ? additionalCertificates.map(title => ({ title }))
                    : [{ title: additionalCertificates }];
            }
        }

        // Check if user already has a business license
        let businessLicense = await BusinessLicense.findOne({ userId });

        if (businessLicense) {
            // Update existing license
            businessLicense.licenses = parsedLicenses;
            businessLicense.professionalServices = parsedProfessionalServices;
            businessLicense.additionalCertificates = parsedCertificates;
            businessLicense.regulatedProfessions = regulatedProfessions || '';
            businessLicense.termsAgreed = otherData.termsAgreed;
            businessLicense.isRegulatedByLaw = otherData.isRegulatedByLaw;
            businessLicense.hasCertificate = otherData.hasCertificate;

            await businessLicense.save();
        } else {
            // Create new license
            businessLicense = await BusinessLicense.create({
                userId,
                licenses: parsedLicenses,
                professionalServices: parsedProfessionalServices,
                additionalCertificates: parsedCertificates,
                regulatedProfessions: regulatedProfessions || '',
                ...otherData
            });
        }

        res.status(201).json({
            success: true,
            message: 'Business license created/updated successfully',
            data: businessLicense
        });
    } catch (err) {
        console.error("Error creating business license:", err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};

exports.getBusinessLicenseByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const businessLicense = await BusinessLicense.findOne({ userId: id });

        if (!businessLicense) {
            return res.status(404).json({
                success: false,
                message: "Business license not found"
            });
        }

        res.status(200).json({
            success: true,
            data: businessLicense
        });
    } catch (err) {
        console.error("Error fetching business license:", err);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message
        });
    }
};

