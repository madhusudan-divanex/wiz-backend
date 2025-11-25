const Marketing = require("../models/marketing.model");

exports.addMarketing = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { experience, expertise } = req.body;

    // Parse the portfolio array
    let thoughtLeadershipPortfolio = [];
    if (req.body.thoughtLeadershipPortfolio) {
      const parsed = JSON.parse(req.body.thoughtLeadershipPortfolio);
      thoughtLeadershipPortfolio = Array.isArray(parsed) ? parsed : [];
    }

    // Add image paths from req.files['imageUrl']
    const imageFiles = req.files?.['imageUrl'] || [];
    thoughtLeadershipPortfolio = thoughtLeadershipPortfolio.map((item, index) => ({
      ...item,
      imageUrl: imageFiles[index] ? `uploads/general/${imageFiles[index].filename}` : '',
    }));

    // Parse additional sections
    let additionalSections = [];
    if (req.body.additionalSections) {
      const parsedSections = JSON.parse(req.body.additionalSections);
      additionalSections = Array.isArray(parsedSections) ? parsedSections : [];

      // Enforce max 3 sections
      if (additionalSections.length > 3) {
        return res.status(400).json({
          success: false,
          message: 'You can only add up to 3 additional sections',
        });
      }

      // Attach gallery images from files if present
      additionalSections = additionalSections.map((section, index) => {
        if (section.type === "gallery" && req.files?.[`galleryImages_${index}`]) {
          section.galleryImages = req.files[`galleryImages_${index}`].map(file => `/uploads/general/${file.filename}`);
        }
        return section;
      });
    }

    const marketingData = new Marketing({
      userId,
      experience,
      expertise,
      videoIntro: req.files?.['videoIntro']?.[0]
        ? `/uploads/general/${req.files['videoIntro'][0].filename}`
        : '',
      thoughtLeadershipPortfolio,
      additionalSections,
    });

    await marketingData.save();

    res.status(201).json({
      success: true,
      message: 'Marketing data added successfully',
      data: marketingData,
    });
  } catch (error) {
    console.error('Add marketing error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getMarketingByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const marketingData = await Marketing.findOne({ userId });

    if (!marketingData) {
      return res.status(404).json({
        success: false,
        message: 'No marketing data found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: marketingData,
    });
  } catch (error) {
    console.error('Admin get marketing error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
