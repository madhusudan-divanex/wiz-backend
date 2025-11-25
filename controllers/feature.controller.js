const Features = require('../models/feature.model');
const User = require('../models/user.model');
const sendEmail = require('../utils/sendMail');

// Create features
exports.createFeatures = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { recommendations, referenceProgram, references } = req.body;

    // Validation: if referenceProgram is true, need 3 references
    if (referenceProgram && !references) {
      return res.status(400).json({
        success: false,
        message: 'Please provide references when joining the Reference Program.',
      });
    }

    const newFeatures = new Features({ userId, recommendations, referenceProgram, references });
    await newFeatures.save();
    // Get user's email
    const user = req.user.email ? req.user : await User.findById(userId);
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
    res.status(201).json({ success: true, message: 'Features saved successfully', data: newFeatures });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all
exports.getFeatures = async (req, res) => {
  try {
    const features = await Features.find().sort({ createdAt: -1 });
    res.json({ success: true, data: features });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getFeaturesByUserId = async (req, res) => {
  try {
    const userId  = req.params.id;

    const features = await Features.findOne({ userId });

    if (!features) {
      return res.status(404).json({
        success: false,
        message: 'Nofeatures found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: features,
    });
  } catch (error) {
    console.error('Admin get features  error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
