const ProfileForm = require("../models/Consumer/Profile");
const PreferenceForm = require("../models/Consumer/Preference");
const StayUpdated = require("../models/Consumer/StayUpdate");
const BasketForm = require("../models/Consumer/Basket");
const ServiceForm = require("../models/Consumer/Service");
const User = require("../models/user.model");
const safeUnlink = require("../utils/globalFuntion");
const Chat = require("../models/Chat");
const Basket = require("../models/Consumer/Basket");
const ConsumerReferences = require("../models/Consumer/ConsumerReferences");

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = req.body;
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })

    const updated = await ProfileForm.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Profile form saved successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving profile form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const form = await ProfileForm.findOne({ userId });
    const chat = await Chat.find({ from: userId }).populate('to'); // assuming userId in Chat is receiver
    // 🔹 Check if user has chatted with any provider
    const isBasket = await Basket.exists({ userId })
    const allowEdit = chat.some(c => c.to?.role === "provider");

    return res.status(200).json({
      status: true,
      data: form,
      allowEdit, isBasket
    });
  } catch (error) {
    console.error("Error fetching profile form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
exports.createOrUpdateBasket = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = req.body;
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })


    const result = await BasketForm.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );

    const updated = result;
    const isNew = new Date(result.createdAt) !== new Date(result.updatedAt) ? false : true
    return res.status(200).json({
      status: true,
      message: "Basket form saved successfully",
      data: updated,
      isNew
    });
  } catch (error) {
    console.error("Error saving basket form:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.getBasketByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const form = await BasketForm.findOne({ userId });

    return res.status(200).json({
      status: true,
      data: form,
    });
  } catch (error) {
    console.error("Error fetching basket form:", error);
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
exports.createOrUpdateStayUpdated = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = req.body;
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })
    const isExist = await StayUpdated.findOne({ userId })
    user.status = 'live'
    await user.save()
    const updated = await StayUpdated.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );
    if (isExist) {
      user.status = 'pending'
      await user.save()
    }

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
    const form = await StayUpdated.findOne({ userId });

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

exports.updateImage = async (req, res) => {
  const { userId } = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(200).json({ message: "User not found", status: false })

    const data = await ProfileForm.findOne({ userId });
    if (data &&data?.profileImage) {
      safeUnlink(data.profileImage)
    }
    if(data){
      await ProfileForm.findByIdAndUpdate(data._id, { profileImage: image }, { new: true })
    } else {
      await ProfileForm.create({ userId, profileImage: image, firstName: user.firstName, lastName: user.lastName, email: user.email })
    }
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
exports.addReference = async (req, res) => {
  const { userId, } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res
      .status(200)
      .json({ message: "User not found", status: false, });

    await ConsumerReferences.create(req.body)
    return res
      .status(200)
      .json({ message: "Reference add", status: true, });
  } catch (error) {
    console.error("Error updating reference:", error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};
exports.getReference = async (req, res) => {
  const userId = req.params.id;

  // Convert query params to numbers
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    const references = await ConsumerReferences.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await ConsumerReferences.countDocuments({ userId });

    return res.status(200).json({
      message: "References fetched successfully",
      status: true,
      data: references,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching references:", error);
    return res.status(500).json({
      message: "Server Error",
      status: false,
    });
  }
};

exports.removeReference = async (req, res) => {
  const { userId, referenceId } = req.body; // or req.params if you send it via URL

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found", status: false });

    const consumer = await ConsumerReferences.findById(referenceId);

    if (!consumer) {
      return res.status(200).json({ message: "Not Found", status: false })
    }
    await ConsumerReferences.findByIdAndDelete(referenceId)

    return res.status(200).json({
      message: "Reference removed successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error removing reference:", error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};