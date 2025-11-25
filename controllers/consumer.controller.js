const ProfileForm =  require("../models/Consumer/Profile");
const PreferenceForm =  require("../models/Consumer/Preference");
const StayUpdated =  require("../models/Consumer/StayUpdate");
const BasketForm =  require("../models/Consumer/Basket");
const ServiceForm =  require("../models/Consumer/Service");
const User = require("../models/user.model");
const safeUnlink = require("../utils/globalFuntion");

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = req.body;
    const user=await User.findById(userId)
    if (!user) return res.status(200).json({message:"User not found",status:false})

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

    return res.status(200).json({
      status: true,
      data: form,
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
    const user=await User.findById(userId)
    if (!user) return res.status(200).json({message:"User not found",status:false})
   

    const result = await BasketForm.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );
  
    const updated = result;            
    const isNew = new Date(result.createdAt) !== new Date(result.updatedAt) ?false:true
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
    const user=await User.findById(userId)
    if (!user) return res.status(200).json({message:"User not found",status:false})

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
    const user=await User.findById(userId)
    if (!user) return res.status(200).json({message:"User not found",status:false})
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
    const user=await User.findById(userId)
    if (!user) return res.status(200).json({message:"User not found",status:false})
    const isExist=await StayUpdated.findOne({userId})
    user.status='live'
    await user.save()
    const updated = await StayUpdated.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );
    if(isExist){
      user.status='pending'
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
    const user=await User.findById(userId)
    if (!user) return res.status(200).json({message:"User not found",status:false})

    const data = await ProfileForm.findOne({ userId });
    if(data.image){
      safeUnlink(data.image)
    }
    await ProfileForm.findByIdAndUpdate(data._id,{profileImage:image},{new:true})

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