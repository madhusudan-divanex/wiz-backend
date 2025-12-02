const ProviderProfile = require('../models/Provider/providerProfile.model');
const ProviderMarketing = require('../models/Provider/providerMarketing.model');
const ProviderFeature = require('../models/Provider/providerFeatures.model');
const ProviderAccreditation = require('../models/Provider/providerAccreditation.model');
const Advertisement = require('../models/Provider/providerAdvertisement.model');
const Reference = require('../models/Provider/providerReferences.model');
const RecommendedUser = require('../models/Recommendation.model')
const sendEmail = require('../utils/sendMail')
const User = require('../models/user.model');
const safeUnlink = require('../utils/globalFuntion');
const StayUpdate = require('../models/Provider/providerStayUpdate.model');
const ServiceForm = require('../models/Provider/providerServices.model');
const PreferenceForm = require('../models/Provider/providerBusinessPreference.model');
const { default: mongoose } = require('mongoose');


exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      name,
      title,
      userId,
      type,
      company,
      location,
      avatar,
      idealClientProfile,
      categories,
      isDefaultBanner
    } = req.body;

    // const userId = req.user.userId ||;

    // Find existing profile
    let profile = await ProviderProfile.findOne({ userId });

    // Parse categories if needed
    let categoriesData = categories;
    if (typeof categories === 'string') {
      categoriesData = JSON.parse(categories);
    }

    const mappedCategories = categoriesData.map(cat => ({
      category: cat.category,
      service: cat.services || cat.service || []
    }));



    // Handle media file updates
    let bannerImage = profile?.bannerImage || '';
    let profileImage = profile?.profileImage || '';
    let videoIntro = profile?.videoIntro || '';

    if (req.files?.['bannerImage']?.[0]) {
      // Delete old banner image if exists
      safeUnlink(bannerImage);
      bannerImage = req.files['bannerImage'][0].path;
    }

    if (req.files?.['profileImage']?.[0]) {
      // Delete old profile image if exists
      safeUnlink(profileImage);
      profileImage = req.files['profileImage'][0].path;
    }

    if (req.files?.['videoIntro']?.[0]) {
      // Delete old video intro if exists
      safeUnlink(videoIntro);
      videoIntro = req.files['videoIntro'][0].path;
    }

    const profileData = {
      userId,
      name,
      title,
      type,
      isDefaultBanner,
      company,
      location,
      avatar,
      idealClientProfile,
      bannerImage,
      profileImage,
      videoIntro,
      categories: mappedCategories
    };

    if (profile) {
      // Update existing profile
      profile = await ProviderProfile.findOneAndUpdate(
        { userId },
        profileData,
        { new: true }
      );
    } else {
      // Create new profile
      profile = new ProviderProfile(profileData);
      await profile.save();
    }

    return res.status(200).json({ status: true, data: profile });
  } catch (err) {

    if (req.files?.['bannerImage']?.[0]) {
      // Delete old banner image if exists
      safeUnlink(req.files['bannerImage'][0].path);
    }

    if (req.files?.['profileImage']?.[0]) {
      // Delete old profile image if exists
      profileImage = req.files['profileImage'][0].path;
      safeUnlink(profileImage);
    }

    if (req.files?.['videoIntro']?.[0]) {
      // Delete old video intro if exists
      videoIntro = req.files['videoIntro'][0].path;
      safeUnlink(videoIntro);
    }
    console.error(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

exports.getProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const profile = await ProviderProfile.findOne({ userId }).populate('categories.category')   // populate the main category inside each subdoc
      .populate('categories.service');   // populate the service array inside each subdoc


    if (!profile) {
      return res.status(404).json({ status: false, message: 'Profile not found' });
    }
    const totalRecommend = await RecommendedUser.countDocuments({ recommendedUser: userId })

    return res.status(200).json({ status: true, data: profile, totalRecommend });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};

exports.addMarketing = async (req, res) => {
  try {
    const { experience, expertise, userId } = req.body;

    // --- Handle Portfolio ---
    let thoughtLeadershipPortfolio = [];
    if (req.body.thoughtLeadershipPortfolio) {
      const parsedPortfolio = JSON.parse(req.body.thoughtLeadershipPortfolio);
      thoughtLeadershipPortfolio = Array.isArray(parsedPortfolio) ? parsedPortfolio : [];
    }

    // Get existing marketing data if any
    const existingMarketing = await ProviderMarketing.findOne({ userId });

    // Attach new portfolio images or keep old ones
    const portfolioImages = req.files?.['imageUrl'] || [];
    thoughtLeadershipPortfolio = thoughtLeadershipPortfolio.map((item, index) => ({
      ...item,
      imageUrl: portfolioImages[index]
        ? `/uploads/provider/${portfolioImages[index].filename}`
        : existingMarketing?.thoughtLeadershipPortfolio?.[index]?.imageUrl || '',
    }));

    // --- Handle Additional Sections ---
    let additionalSections = [];
    if (req.body.additionalSections) {
      const parsedSections = JSON.parse(req.body.additionalSections);
      additionalSections = Array.isArray(parsedSections) ? parsedSections : [];

      // Enforce max 3 sections
      if (additionalSections.length > 3) {
        return res.status(400).json({
          status: false,
          message: 'You can only add up to 3 additional sections',
        });
      }

      // Handle gallery images safely
      additionalSections = additionalSections.map((section, index) => {
        if (section.type === 'gallery') {
          // Use new files if uploaded
          if (req.files?.[`galleryImages_${index}`]) {
            section.galleryImages = req.files[`galleryImages_${index}`].map(
              file => `/uploads/provider/${file.filename}`
            );
          } else if (existingMarketing?.additionalSections?.[index]?.galleryImages) {
            // Keep previous gallery images
            section.galleryImages = existingMarketing.additionalSections[index].galleryImages;
          } else {
            section.galleryImages = [];
          }
        }
        return section;
      });
    }

    // --- Handle menu and videoIntro ---
    const menuPath = req.files?.['menu']?.[0]
      ? `/uploads/provider/${req.files['menu'][0].filename}`
      : existingMarketing?.menu || '';

    const videoPath = req.files?.['videoIntro']?.[0]
      ? `/uploads/provider/${req.files['videoIntro'][0].filename}`
      : existingMarketing?.videoIntro || '';

    // Delete old files only if replaced
    if (existingMarketing) {
      if (req.files?.['menu']?.[0] && existingMarketing.menu) safeUnlink(existingMarketing.menu);
      if (req.files?.['videoIntro']?.[0] && existingMarketing.videoIntro) safeUnlink(existingMarketing.videoIntro);
    }

    // --- Save Marketing Data ---
    let marketingData;
    if (existingMarketing) {
      marketingData = await ProviderMarketing.findByIdAndUpdate(
        existingMarketing._id,
        {
          userId,
          experience,
          expertise,
          menu: menuPath,
          videoIntro: videoPath,
          thoughtLeadershipPortfolio,
          additionalSections,
        },
        { new: true }
      );
    } else {
      marketingData = new ProviderMarketing({
        userId,
        experience,
        expertise,
        menu: menuPath,
        videoIntro: videoPath,
        thoughtLeadershipPortfolio,
        additionalSections,
      });
      await marketingData.save();
    }

    return res.status(201).json({
      status: true,
      message: 'Marketing data saved successfully',
      data: marketingData,
    });

  } catch (error) {
    console.error('Add marketing error:', error);
    return res.status(500).json({ status: false, message: 'Server Error', error: error.message });
  }
};
exports.getMarketingByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const marketing = await ProviderMarketing.findOne({ userId: userId });

    if (!marketing) {
      return res.status(404).json({ status: false, message: 'Marketing data not found' });
    }

    return res.status(200).json({ status: true, data: marketing });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};
exports.createAccerditation = async (req, res) => {
  try {
    const {
      userId,
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
          status: false,
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
          licenseFiles[index] = `/uploads/provider/${file.filename}`;
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

    let businessLicense = await ProviderAccreditation.findOne({ userId });
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
      businessLicense = await ProviderAccreditation.create({
        userId,
        licenses: parsedLicenses,
        professionalServices: parsedProfessionalServices,
        additionalCertificates: parsedCertificates,
        regulatedProfessions: regulatedProfessions || '',
        ...otherData
      });
    }

    return res.status(201).json({
      status: true,
      message: 'Business license created/updated successfully',
      data: businessLicense
    });
  } catch (err) {
    console.error("Error creating business license:", err);
    return res.status(500).json({
      status: false,
      message: "Server Error",
      error: err.message
    });
  }
};
exports.getAccerditationByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const accreditation = await ProviderAccreditation.findOne({ userId: userId });
    if (!accreditation) {
      return res.status(404).json({ status: false, message: 'Accreditation data not found' });
    }
    return res.status(200).json({ status: true, data: accreditation });
  } catch (err) {
    return res.status(500).json({ status: false, message: 'Server Error' });
  }
};
exports.createFeatures = async (req, res) => {
  try {
    const { recommendations, referenceProgram, references, userId, connection, chatShow } = req.body;
    let formattedConnection = [];
    if (Array.isArray(connection)) {
      formattedConnection = connection.map(id => ({
        userId: id,
        status: 'pending'
      }));
    }

    // Validation: if referenceProgram is true, need 3 references
    if (referenceProgram && !references) {
      return res.status(400).json({
        success: false,
        message: 'Please provide references when joining the Reference Program.',
      });
    }
    const alreadyExist = await ProviderFeature.findOne({ userId })
    if (alreadyExist) {
      const newFeatures = await ProviderFeature.findByIdAndUpdate(alreadyExist._id, { userId, recommendations, referenceProgram, references, connection: formattedConnection, chatShow }, { new: true });
      return res.status(200).json({ status: true, message: 'Features updated successfully', data: newFeatures });

    } else {
      const newFeatures = new ProviderFeature({ userId, recommendations, referenceProgram, references, connection: formattedConnection, chatShow });
      await newFeatures.save();
      // Get user's email
      const user = await User.findById(userId)
      const email = user.email;

      // HTML Email Content (converted JSX → HTML string)
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h4>Thank You</h4>
          <p>Your preferences have been saved successfully.<br/>
          We appreciate your time and effort!</p>
          <h5>Thank you for joining the Wizbizla Marketplace.</h5>
          <p>
            By submitting, you confirm that all information provided is accurate and complete.
            Any incorrect or incomplete details may delay onboarding.
          </p>
          <p>
            We'll optimise your Business Profile for effective lead generation and contact you if further details are required.
            Once approved and our platform is LIVE, you'll receive your login details.
            <br/>
            For assistance, email
            <a href="mailto:hello@wizbizla.com" style="text-decoration: underline;">hello@wizbizla.com</a>.
          </p>
          <div>
            <a href="https://wizbizla.com/" target="_blank" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:#fff; text-decoration:none; border-radius:4px;">Go to Wizbizla</a>
          </div>
        </div>
      `;
      // Send email
      await sendEmail({
        to: email,
        subject: "Thank You for Joining Wizbizla!",
        html: emailHtml
      });
      return res.status(201).json({ status: true, message: 'Features saved successfully', data: newFeatures });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: false, message: 'Server Error', error: error.message });
  }
};
exports.getFeaturesByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const { page = 0, limit = 9 } = req.query;

    const feature = await ProviderFeature.findOne({ userId })
      .populate({
        path: 'connection.userId',
        select: 'firstName lastName email',
      });

    if (!feature) {
      return res
        .status(404)
        .json({ status: false, message: 'Feature data not found' });
    }
    if (req.query.page == undefined) {
      return res
        .status(200)
        .json({ status: true, data: feature });
    }

    // Pagination logic for `connection`
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedConnections = feature.connection.slice(startIndex, endIndex);

    // Fetch provider profiles only for paginated connections
    const profileData = await Promise.all(
      paginatedConnections.map(async (user) => {
        const profileData =
          (await ProviderProfile.findOne({ userId: user.userId._id }).select('profileImage').lean()) || {};
        return {
          ...user.toObject(),
          profileData,
        };
      })
    );

    return res.status(200).json({
      status: true,
      data: {
        ...feature.toObject(),
        connection: profileData,
      },
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(feature.connection.length / limit),
        totalConnections: feature.connection.length,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, message: 'Server Error', error: err.message });
  }
};

//      Advertisement

// CREATE advertisement
exports.createAd = async (req, res) => {
  const { userId, accountName, email, detail, contactNumber, spot, usePoint } = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    const newAd = new Advertisement({
      userId,
      accountName,
      email,
      detail,
      spot,
      contactNumber,
      image,
      usePoint: usePoint || false,
    });

    const savedAd = await newAd.save();
    return res.status(200).json({ status: true, message: 'Advertisement created successfully', data: savedAd });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Failed to create advertisement', error: error.message });
  }
};



// READ advertisement by ID
exports.getAdById = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const page = parseInt(req.query.page) || 1; // current page, default 1
    const limit = parseInt(req.query.limit) || 9; // items per page, default 10
    const skip = (page - 1) * limit;

    const total = await Advertisement.countDocuments({ userId: id });
    const ads = await Advertisement.find({ userId: id })
      .populate('userId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: latest first

    if (!ads || ads.length === 0)
      return res.status(404).json({ status: false, message: 'Advertisement not found' });

    return res.status(200).json({
      status: true,
      message: 'Advertisements fetched successfully',
      data: ads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Failed to fetch advertisements', error: error.message });
  }
};


// UPDATE advertisement by ID
exports.updateAd = async (req, res) => {
  const image = req.files?.['image']?.[0]?.path
  const { userId, accountName, email, detail, contactNumber, spot, usePoint, adId } = req.body;
  try {
    const isExist = await Advertisement.findById(adId)
    if (image) {
      safeUnlink(isExist.image)
    }
    const updatedAd = await Advertisement.findByIdAndUpdate(
      adId,
      { userId, accountName, email, detail, contactNumber, usePoint },
      { new: true }
    );

    if (!updatedAd) return res.status(404).json({ status: false, message: 'Advertisement not found' });

    return res.status(200).json({ status: true, message: 'Advertisement updated successfully', data: updatedAd });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: 'Failed to update advertisement', error: error.message });
  }
};

// DELETE advertisement by ID
exports.deleteAd = async (req, res) => {
  const { id } = req.params;
  try {
    const isExist = await Advertisement.findById(id)
    const deletedAd = await Advertisement.findByIdAndDelete(id);

    if (!deletedAd) return res.status(404).json({ status: false, message: 'Advertisement not found' });
    safeUnlink(isExist.image)
    return res.status(200).json({ status: true, message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Failed to delete advertisement', error: error.message });
  }
};

exports.addTrustedReference = async (req, res) => {
  const { userId, referenceUser, status, comment } = req.body;
  try {
    const isExist = await User.findById(userId)
    if (!isExist) return res.status(200).json({ message: "User not found", status: false })
    const isRef = await Reference.findOne({ userId, referenceUser })
    if (isRef) return res.status(200).json({ status: true })
    const newRef = await Reference.create({ userId, referenceUser, status, comment });
    return res.status(200).json({ status: true, message: 'Reference created successfully', data: newRef });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Failed to create reference', error: error.message });
  }
};
exports.getTrustedReference = async (req, res) => {
  const userId = req.params.id;
  const { page, limit } = req.query;

  try {
    const isExist = await User.findById(userId);
    if (!isExist) {
      return res.status(200).json({ message: "User not found", status: false });
    }

    let refData;
    let totalCount;

    // ✅ If pagination query exists
    if (page) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const skip = (pageNum - 1) * limitNum;

      totalCount = await Reference.countDocuments({ userId });
      refData = await Reference.find({ userId })
        .populate({ path: 'userId', select: 'firstName lastName' })
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        message: "Reference fetched successfully (paginated)",
        data: refData,
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
      });
    }

    // ✅ If no pagination query, return all
    refData = await Reference.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Reference fetched successfully",
      data: refData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch Reference",
      error: error.message,
    });
  }
};

exports.addReference = async (req, res) => {
  const { userId, refData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found", status: false });
    const isMatch = await User.findOne({ email: refData.email, role: 'provider' });
    if (!isMatch)
      return res.status(404).json({ message: "User not found", status: false });
    let provider = await ProviderFeature.findOne({ userId });
    if (!provider)
      return res
        .status(404)
        .json({ message: "Provider data not found", status: false });

    // Push new reference
    provider.references.push(refData);

    // Save updated provider
    await provider.save();

    return res
      .status(200)
      .json({ message: "Reference updated", status: true, data: provider });
  } catch (error) {
    console.error("Error updating reference:", error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};
exports.removeReference = async (req, res) => {
  const { userId, referenceId } = req.body; // or req.params if you send it via URL

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found", status: false });

    const provider = await ProviderFeature.findOne({ userId });
    if (!provider)
      return res
        .status(404)
        .json({ message: "Provider data not found", status: false });

    const refIndex = provider.references.findIndex(
      (ref) => ref._id.toString() === referenceId
    );

    if (refIndex === -1)
      return res
        .status(404)
        .json({ message: "Reference not found", status: false });

    provider.references.splice(refIndex, 1);

    // Save changes
    await provider.save();

    return res.status(200).json({
      message: "Reference removed successfully",
      status: true,
      data: provider,
    });
  } catch (error) {
    console.error("Error removing reference:", error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};
exports.createOrUpdateStayUpdated = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = req.body;
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })
    const updated = await StayUpdate.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    )

    return res.status(200).json({
      status: true,
      message: "Stay Updated form saved successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving stay updated form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getStayUpdatedByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const form = await StayUpdate.findOne({ userId });

    return res.status(200).json({
      status: true,
      data: form,
    });
  } catch (error) {
    console.error("Error fetching stay updated form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
exports.createOrUpdateService = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = req.body;
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })

    const updated = await ServiceForm.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Service form saved successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving service form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getServiceByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const form = await ServiceForm.findOne({ userId });

    return res.status(200).json({
      status: true,
      data: form,
    });
  } catch (error) {
    console.error("Error fetching service form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.createOrUpdatePreference = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })
    const data = req.body;

    const updated = await PreferenceForm.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Preference form saved successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving preference form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getPreferenceByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const form = await PreferenceForm.findOne({ userId });

    return res.status(200).json({
      status: true,
      data: form,
    });
  } catch (error) {
    console.error("Error fetching preference form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
exports.updateImage = async (req, res) => {
  const { userId } = req.body;
  const image = req.files?.['profileImage']?.[0]?.path
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })

    const data = await ProviderProfile.findOne({ userId });
    if (data.image) {
      safeUnlink(data.profileImage)
    }
    await ProviderProfile.findByIdAndUpdate(data._id, { profileImage: image }, { new: true })

    return res.status(200).json({
      status: true,
      message: "Profile image saved successfully",
    });
  } catch (error) {
    console.error("Error saving profile image:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
exports.deleteImage = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })

    const data = await ProviderProfile.findOne({ userId });
    if (data.image) {
      safeUnlink(data.profileImage)
    }
    await ProviderProfile.findByIdAndUpdate(data._id, { profileImage: '' }, { new: true })

    return res.status(200).json({
      status: true,
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};