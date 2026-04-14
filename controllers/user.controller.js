const mongoose = require('mongoose');
// const { default: mongoose } = require('mongoose');
const ProviderProfile = require('../models/Provider/providerProfile.model');
const BusinessProfile = require('../models/Provider/businessProfile.model');
const ProviderMarketing = require('../models/Provider/providerMarketing.model');
const ProviderFeature = require('../models/Provider/providerFeatures.model');
const FeedBack = require('../models/Provider/providerFeedback.model');
const ProviderAccreditation = require('../models/Provider/providerAccreditation.model');
const DeleteUser = require('../models/deleteUser.model');
const ScamReport = require('../models/ScamReport')
const BookCustomer = require('../models/BookCustomer')
const Profile = require('../models/profile.model');
const Marketing = require('../models/marketing.model');
const Feature = require('../models/feature.model');
const Accreditation = require('../models/businessLicense.model');
const Advertisement = require('../models/Provider/providerAdvertisement.model');
const Reference = require('../models/Provider/providerReferences.model');
const Billing = require('../models/Provider/providerBilling.model');
const Chat = require('../models/Chat')
const BookMarkProfile = require('../models/Bookmark.model');
const RecommendedUser = require('../models/Recommendation.model');
const ProfileView = require('../models/ProfileView.model');
const Otp = require('../models/otp.model')
const User = require('../models/user.model');
const Membership = require('../models/membership.model');
const BuyMembership = require('../models/buymembership.model');
const Login = require('../models/loginUser.model');
const path = require('path');
const fs = require('fs');
const {sendEmail} = require('../utils/sendMail');
const safeUnlink = require('../utils/globalFuntion');
const PodcastSubscriber = require('../models/PodcastSubscriber');
const Contact = require('../models/Contact');
const ConsumerProfile = require('../models/Consumer/Profile');
const PreferenceForm = require("../models/Consumer/Preference");
const StayUpdated = require("../models/Consumer/StayUpdate");
const BasketForm = require("../models/Consumer/Basket");
const ServiceForm = require("../models/Consumer/Service");
const Feedback = require('../models/Feedback');
const OpenDispute = require('../models/OpenDispute');
const RequestBespoke = require('../models/RequestBespoke');
const NewsLetter = require('../models/NewsLetter');
const BookmarkModel = require('../models/Bookmark.model');
const ConsumerReferences = require('../models/Consumer/ConsumerReferences');
const Notifications = require('../models/Notifications');
const AddOnService = require('../models/addOnServices.model')
const { checkEmail } = require('../utils/sendMail');
const Transaction = require('../models/Transaction.model');
const BlogSubscriber = require('../models/BlogSubscriber');

// ✅ CREATE
exports.createUseradmin = async (req, res) => {
  try {
    const isExist = await User.findOne({ email: req.body.email })
    if (isExist) return res.status(200).json({ message: "User already exist", success: false })
    const user = await User.create(req.body);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, q = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Build the search filter
    const searchFilter = {
      role: { $ne: 'admin' },
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    };

    // Aggregation pipeline
    const pipeline = [
      { $match: searchFilter },
      {
        $lookup: {
          from: 'profiles', // collection name in MongoDB (lowercase + plural)
          localField: '_id',
          foreignField: 'userId',
          as: 'profile'
        }
      },
      {
        $match: {
          'profile.0': { $exists: true } // ensure profile exists
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $facet: {
          metadata: [
            { $count: "total" },
            {
              $addFields: {
                currentPage: page,
                totalPages: {
                  $ceil: {
                    $divide: ["$total", limit]
                  }
                }
              }
            }
          ],
          users: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                password: 0 // exclude password if needed
              }
            }
          ]
        }
      }
    ];

    const result = await User.aggregate(pipeline);
    const metadata = result[0].metadata[0] || {
      total: 0,
      currentPage: page,
      totalPages: 0
    };

    res.status(200).json({
      success: true,
      totalUsers: metadata.total,
      currentPage: metadata.currentPage,
      totalPages: metadata.totalPages,
      users: result[0].users
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ READ BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });
    const membershipData = await BuyMembership.findOne({ userId: req.params.id, status: { $ne: 'next' } }).sort({ createdAt: -1 }).populate('membershipId')
    return res.status(200).json({ success: true, user, membershipData });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ UPDATE
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ✅ DELETE
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id
    const isExist = await User.findById(userId)
    if (!isExist) return res.status(200).json({ message: "User not found", success: false })

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not deleted' });

    const pvdProData = await ProviderProfile.findOne({ userId })
    if (pvdProData) {
      safeUnlink(pvdProData?.avatar)
      safeUnlink(pvdProData?.bannerImage)
      safeUnlink(pvdProData?.profileImage)
    }
    
    const pvdAcdData = await ProviderAccreditation.findOne({ userId })
    if (pvdAcdData) {
      for (let data of pvdAcdData.licenses) {
        safeUnlink(data?.tradeLicenseFile)
      }
    }
    console.log("pvdAcdData", pvdAcdData)

    const mktData = await ProviderMarketing.findOne({ userId })
    if (mktData) {
      safeUnlink(mktData?.menu)
      safeUnlink(mktData?.videoIntro)
      for (let data of mktData.additionalSections) {
        if (data?.type == 'gallery') {
          for (let img of data?.galleryImages) {
            safeUnlink(img)
          }
        }
      }
      for (let data of mktData.thoughtLeadershipPortfolio) {
        safeUnlink(data?.imageUrl)
      }
    }
    console.log("mkdData", mktData)
    const adData = await Advertisement.find({ userId })
    if (adData.length > 0) {
      for (let data of adData) {
        safeUnlink(data?.image)
      }
    }
    const scamData = await ScamReport.find({ userId })
    if (scamData.length > 0) {
      for (let data of scamData) {
        const isBookMark = await BookmarkModel.deleteMany({ trackerBookmark: data._id })
        safeUnlink(data?.image)
      }
    }
    console.log("scamData", scamData)
    const chatData = await Chat.find({
      $or: [{ from: userId }, { to: userId }]
    });

    for (let data of chatData) {
      if (data?.chatImg) {
        safeUnlink(data.chatImg);
      }
    }

    await Chat.deleteMany({
      $or: [{ from: userId }, { to: userId }]
    });

    await BuyMembership.deleteMany({ userId })
    await ConsumerReferences.deleteMany({ userId })
    await Login.deleteMany({ userId })
    await Otp.deleteMany({ userId })
    await ProviderFeature.findOneAndDelete({ userId })
    await ProviderAccreditation.findOneAndDelete({ userId })
    await ProviderProfile.findOneAndDelete({ userId })
    await ProfileView.deleteMany({ userId })
    await ProfileView.deleteMany({ viewUserId: userId })
    await ProviderMarketing.findOneAndDelete({ userId })
    await BookMarkProfile.deleteMany({ bookmarkUser: userId })
    await BookMarkProfile.deleteMany({ userId })
    await RecommendedUser.deleteMany({ userId })
    await RecommendedUser.deleteMany({ recommendedUser: userId })
    await ScamReport.deleteMany({ userId })
    await Advertisement.deleteMany({ userId })
    await Reference.deleteMany({ userId })
    await Reference.deleteMany({ referenceUser: userId })
    await FeedBack.deleteMany({ userId })
    await FeedBack.deleteMany({ feedbackUser: userId })
    await RequestBespoke.deleteMany({ userId })
    await OpenDispute.deleteMany({ userId })
    const disputeImage = await OpenDispute.find({ against: userId })
    for (let d of disputeImage) {
      safeUnlink(d.image)
    }
    await OpenDispute.deleteMany({ against: userId })
    await ProviderFeature.updateMany(
      { "connection.userId": userId },
      { $pull: { connection: { userId } } }
    );


    const onPvdProData = await Profile.findOne({ userId })
    if (onPvdProData) {
      safeUnlink(onPvdProData?.avatar)
      safeUnlink(onPvdProData?.bannerImage)
      safeUnlink(onPvdProData?.profileImage)
    }
    const onPvdAcdData = await Accreditation.findOne({ userId })
    if (onPvdAcdData) {
      for (let data of onPvdAcdData.licenses) {
        safeUnlink(data?.tradeLicenseFile)
      }
    }

    const onMktData = await Marketing.findOne({ userId })
    if (onMktData) {
      safeUnlink(onMktData?.menu)
      safeUnlink(onMktData?.videoIntro)
      for (let data of onMktData.additionalSections) {
        if (data?.type == 'gallery') {
          for (let img of data?.galleryImages) {
            safeUnlink(img)
          }
        }
      }
      for (let data of onMktData.thoughtLeadershipPortfolio) {
        safeUnlink(data?.imageUrl)
      }
    }
    await Feature.findOneAndDelete({ userId })
    await Accreditation.findOneAndDelete({ userId })
    await Profile.findOneAndDelete({ userId })
    await Marketing.findOneAndDelete({ userId })
    //    consumer data 
    await ConsumerProfile.findOneAndDelete({ userId })
    await BasketForm.findOneAndDelete({ userId })
    await ServiceForm.findOneAndDelete({ userId })
    await PreferenceForm.findOneAndDelete({ userId })
    await StayUpdated.findOneAndDelete({ userId })

    if(req.query.deleteBy=="admin"  && user.role=='provider'){
      await checkEmail(user.email,user.firstName,'profileRemoveAdmin')
    }
    if(req.query.deleteBy!=="admin" ){
      await checkEmail(user.email,user.firstName,'selfAccountClose')
    }
    await User.findByIdAndDelete(userId)
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, error: err.message });
  }
};
exports.deleteUserWithReason = async (req, res) => {
  const { userId, reason } = req.body
  try {
    const isExist = await User.findById(userId)
    if (!isExist) return res.status(200).json({ message: "User not found", success: false })
    const dataToInsert = {
      email: isExist.email,
      contactNumber: isExist.contactNumber,
      firstName: isExist.firstName,
      lastName: isExist.lastName,
      reason
    }

    // You can log the reason to a separate collection if needed
    // await DeletionReason.create(dataToInsert); // Assuming you have a model for this
    const data = await DeleteUser.create(dataToInsert);
    const user = await User.findByIdAndDelete(userId);

    if (!user)
      return res.status(404).json({ success: false, message: 'User not deleted' });

    const pvdProData = await ProviderProfile.findOne({ userId })
    if (pvdProData) {
      safeUnlink(pvdProData?.avatar)
      safeUnlink(pvdProData?.bannerImage)
      safeUnlink(pvdProData?.profileImage)
    }
    console.log("pvdProData", pvdProData)
    const pvdAcdData = await ProviderAccreditation.findOne({ userId })
    if (pvdAcdData) {
      for (let data of pvdAcdData.licenses) {
        safeUnlink(data?.tradeLicenseFile)
      }
    }
    console.log("pvdAcdData", pvdAcdData)

    const mktData = await ProviderMarketing.findOne({ userId })
    if (mktData) {
      safeUnlink(mktData?.menu)
      safeUnlink(mktData?.videoIntro)
      for (let data of mktData.additionalSections) {
        if (data?.type == 'gallery') {
          for (let img of data?.galleryImages) {
            safeUnlink(img)
          }
        }
      }
      for (let data of mktData.thoughtLeadershipPortfolio) {
        safeUnlink(data?.imageUrl)
      }
    }
    console.log("mkdData", mktData)
    const adData = await Advertisement.find({ userId })
    if (adData.length > 0) {
      for (let data of adData) {
        safeUnlink(data?.image)
      }
    }
    console.log("adData", adData)
    const scamData = await ScamReport.find({ userId })
    if (scamData.length > 0) {
      for (let data of scamData) {
        const isBookMark = await BookmarkModel.deleteMany({ trackerBookmark: data._id })
        safeUnlink(data?.image)
      }
    }
    console.log("scamData", scamData)
    const chatData = await Chat.find({
      $or: [{ from: userId }, { to: userId }]
    });

    for (let data of chatData) {
      if (data?.chatImg) {
        safeUnlink(data.chatImg);
      }
    }

    await Chat.deleteMany({
      $or: [{ from: userId }, { to: userId }]
    });

    await BuyMembership.deleteMany({ userId })
    await Login.deleteMany({ userId })
    await Otp.deleteMany({ userId })
    await ProviderFeature.findOneAndDelete({ userId })
    await ProviderAccreditation.findOneAndDelete({ userId })
    await ProviderProfile.findOneAndDelete({ userId })
    await ProfileView.deleteMany({ userId })
    await ProfileView.deleteMany({ viewUserId: userId })
    await ProviderMarketing.findOneAndDelete({ userId })
    await BookMarkProfile.deleteMany({ bookmarkUser: userId })
    await BookMarkProfile.deleteMany({ userId })
    await RecommendedUser.deleteMany({ userId })
    await RecommendedUser.deleteMany({ recommendedUser: userId })
    await ScamReport.deleteMany({ userId })
    await Advertisement.deleteMany({ userId })
    await Reference.deleteMany({ userId })
    await Reference.deleteMany({ referenceUser: userId })
    await FeedBack.deleteMany({ userId })
    await FeedBack.deleteMany({ feedbackUser: userId })
    await RequestBespoke.deleteMany({ userId })
    await OpenDispute.deleteMany({ userId })
    const disputeImage = await OpenDispute.find({ against: userId })
    for (let d of disputeImage) {
      safeUnlink(d.image)
    }
    await OpenDispute.deleteMany({ against: userId })
    await ProviderFeature.updateMany(
      { "connection.userId": userId },
      { $pull: { connection: { userId } } }
    );


    const onPvdProData = await Profile.findOne({ userId })
    if (onPvdProData) {
      safeUnlink(onPvdProData?.avatar)
      safeUnlink(onPvdProData?.bannerImage)
      safeUnlink(onPvdProData?.profileImage)
    }
    const onPvdAcdData = await Accreditation.findOne({ userId })
    if (onPvdAcdData) {
      for (let data of onPvdAcdData.licenses) {
        safeUnlink(data?.tradeLicenseFile)
      }
    }

    const onMktData = await Marketing.findOne({ userId })
    if (onMktData) {
      safeUnlink(onMktData?.menu)
      safeUnlink(onMktData?.videoIntro)
      for (let data of onMktData.additionalSections) {
        if (data?.type == 'gallery') {
          for (let img of data?.galleryImages) {
            safeUnlink(img)
          }
        }
      }
      for (let data of onMktData.thoughtLeadershipPortfolio) {
        safeUnlink(data?.imageUrl)
      }
    }
    await Feature.findOneAndDelete({ userId })
    await Accreditation.findOneAndDelete({ userId })
    await Profile.findOneAndDelete({ userId })
    await Marketing.findOneAndDelete({ userId })
    //    consumer data 
    await ConsumerProfile.findOneAndDelete({ userId })
    await BasketForm.findOneAndDelete({ userId })
    await ServiceForm.findOneAndDelete({ userId })
    await PreferenceForm.findOneAndDelete({ userId })
    await StayUpdated.findOneAndDelete({ userId })
    await User.findByIdAndDelete(userId)
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.buyMembership = async (req, res) => {
  const { email, cardInformation, phoneNumber, zipCode, country, membershipId, userId, startDate, endDate, price } = req.body
  try {
    const findUser = await User.findById(userId)
    if (!findUser) return res.status(200).json({ message: 'User not found', status: false })
    const findMembership = await Membership.findById(membershipId)
    if (!findMembership) return res.status(200).json({ message: 'Membership not found', status: false })
    const alreadyPurchase = await BuyMembership.findOne({ userId }).sort({ createdAt: -1 })
    if (alreadyPurchase && alreadyPurchase.endDate >= new Date() && alreadyPurchase.membershipId == membershipId) {
      let nextStartDate = new Date(alreadyPurchase.endDate)
      const durationInMs = new Date(endDate) - new Date(startDate);
      const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
      let nextEndDate = new Date(nextStartDate)
      nextEndDate.setDate(nextEndDate.getDate() + durationInDays);
      const newData = await BuyMembership.create({  membershipId, userId, startDate: nextStartDate, endDate: nextEndDate, price, status: 'next' })
      if (newData) {
        const trans=await Transaction.create({userId,buyMembershipId:newData?._id,email, cardInformation, phoneNumber, zipCode, country,amount:price,type:"membership"})
        newData.transactionId=trans._id;
        await newData.save()
        const membershipType = String(findMembership.type).toLowerCase().trim();

        if (membershipType === 'provider') {
          const templatePath = path.join(__dirname, '../utils/provider.html');
          let html = fs.readFileSync(templatePath, 'utf-8');
          html = html.replace('{{name}}', findUser.name || 'User');
          
          // await sendEmail({
          //   to: email,
          //   subject: 'Membership Confirmation',
          //   html
          // });

        } else if (membershipType === 'consumer') {
          const templatePath = path.join(__dirname, '../utils/consumer.html');
          let html = fs.readFileSync(templatePath, 'utf-8');
          const finalName = findMembership.name.replace('Membership', '').trim();
          html = html.replace('{{name}}', findUser.firstName || 'User');
          html = html.replace('{{member}}', finalName || '');
          html = html.replace('{{membership}}', findMembership?.name || '');
          
          // await sendEmail({
          //   to: email,
          //   subject: 'Membership Confirmation',
          //   html
          // });
        }
        const isGold = findMembership.topChoice
        await Notifications.create({ userId, message: "Subscription payment completed successfully" })

        return res.status(200).json({ status: true, isGold, message: "Membership purchased" });
      }
      else {
        return res.status(200).json({ status: false, message: "Membership not purchased" });
      }

    } else {
      const newData = await BuyMembership.create(req.body)
      const isExist = !!(await BuyMembership.findOne({
        userId,
        status: 'expired'
      }));

      if (newData) {
        const trans=await Transaction.create({userId,buyMembershipId:newData?._id,email, cardInformation, phoneNumber, zipCode, country,amount:price,type:"membership"})
        newData.transactionId=trans?._id
        await newData.save()
        const membershipType = String(findMembership.type).toLowerCase().trim();

        if (membershipType === 'provider') {
          const templatePath = path.join(__dirname, '../utils/provider.html');
          let html = fs.readFileSync(templatePath, 'utf-8');
          html = html.replace('{{name}}', findUser.name || 'User');
          await checkEmail(email,findUser.firstName,"providerBuyMembership")

        } else if (membershipType === 'consumer') {
          const templatePath = path.join(__dirname, '../utils/consumer.html');
          let html = fs.readFileSync(templatePath, 'utf-8');
          const finalName = findMembership.name.replace('Membership', '').trim();
          html = html.replace('{{name}}', findUser.firstName || 'User');
          html = html.replace('{{member}}', finalName || '');
          html = html.replace('{{membership}}', findMembership?.name || '');
          if (findMembership.topChoice && membershipType === 'consumer') {
            await checkEmail(email,findUser.firstName,"consumerBuyMembership")
            findUser.monthlyToken = 5
            findUser.tokenDate = new Date()
            await findUser.save()
          }
        }
        const isGold = findMembership.topChoice
        return res.status(200).json({ status: true, isGold, isExist, message: "Membership purchased" });
      }
      else {
        return res.status(200).json({ status: false, message: "Membership not purchased" });
      }
    }
  } catch (err) {
    console.log(err)
    return res.status(200).json({ success: false, error: err.message });
  }
};
exports.upgradeMembership = async (req, res) => {
  const { email, cardInformation, phoneNumber, zipCode, country, membershipId, userId, startDate, endDate, price } = req.body
  try {
    const findUser = await User.findById(userId)
    if (!findUser) return res.status(200).json({ message: 'User not found', status: false })
    const findMembership = await Membership.findById(membershipId)
    if (!findMembership) return res.status(200).json({ message: 'Membership not found', status: false })
    const alreadyPurchase = await BuyMembership.updateMany({ userId, status: 'active' }, { $set: { status: "expired" } })
    const newData = await BuyMembership.create(req.body)
    if (newData) {
      const membershipType = String(findMembership.type).toLowerCase().trim();

      if (membershipType === 'provider') {
        const templatePath = path.join(__dirname, '../utils/provider.html');
        let html = fs.readFileSync(templatePath, 'utf-8');
        html = html.replace('{{name}}', findUser.firstName || 'User');
        // await sendEmail({
        //   to: email,
        //   subject: 'Membership Confirmation',
        //   html
        // });

      } else if (membershipType === 'consumer') {
        const templatePath = path.join(__dirname, '../utils/consumer.html');
        let html = fs.readFileSync(templatePath, 'utf-8');
        const finalName = findMembership.name.replace('Membership', '').trim();
        html = html.replace('{{name}}', findUser.firstName || 'User');
        html = html.replace('{{member}}', finalName || '');
        html = html.replace('{{membership}}', findMembership?.name || '');
        // await sendEmail({
        //   to: email,
        //   subject: 'Membership Confirmation',
        //   html
        // });
      }
      await Notifications.create({ userId, message: "Your subscription has been upgraded to Signature Profile." })
      return res.status(200).json({ status: true, message: "Membership purchased" });
    }
    else {
      return res.status(200).json({ status: false, message: "Membership not purchased" });
    }

  } catch (err) {
    console.log(err.message)
    return res.status(200).json({ success: false, error: err.message });
  }
};
exports.downgradeMembership = async (req, res) => {
  const { userId, membershipId, downGradeId } = req.body
  try {
    const userExist = await User.findById(userId)
    if (!userExist) return res.status(200).json({ success: false, message: "User not exist" })
    const membershipExist = await BuyMembership.findById(membershipId)
    if (!membershipExist) return res.status(200).json({ message: "membership not exist" })
    const dwnMembership = await BuyMembership.findByIdAndUpdate(membershipId, { membershipId: downGradeId }, { new: true })
    await Notifications.create({ userId, message: "Your Subscription has been downgraded to a Business Profile." })
    return res.status(200).json({ success: true, message: 'Membership Downgrade' })
  } catch (error) {
    return res.status(200).json({ message: error.message })
  }
}
exports.cancelMembership = async (req, res) => {
  const { userId, membershipId } = req.body
  try {
    const userExist = await User.findById(userId)
    if (!userExist) return res.status(200).json({ success: false, message: "User not exist" })
    const membershipExist = await BuyMembership.findById(membershipId)
    if (!membershipExist) return res.status(200).json({ message: "membership not exist" })
    const updMembership = await BuyMembership.findByIdAndUpdate(membershipId, { status: 'cancel' }, { new: true })
    return res.status(200).json({ success: true, message: 'Membership Canceld' })
  } catch (error) {
    return res.status(200).json({ message: error.message })
  }
}

//    Scam Report
exports.createScamReport = async (req, res) => {
  const { name, title, userId, description, dateReported, format, scamType, serviceCategory, amountOfLost, reportToAuthoritise, reportedToWhom } = req.body
  const image = req.files?.['image']?.[0]?.path
  try {
    const data = { name, title, userId, description, dateReported, format, scamType, serviceCategory, amountOfLost, reportToAuthoritise, reportedToWhom }
    if (image) {
      data.image = image
    }
    const isUser=await User.findById(userId)
    const scam = await ScamReport.create(data);
    if(isUser){
      await checkEmail(isUser.email,isUser.firstName,'reportScam')
    }
    await Notifications.create({ userId, message: "Scam report submitted successfully." })
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};
exports.userScamReport = async (req, res) => {
  const userId = req.params.id;
  let { page = 1, limit = 9 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const isExist = await User.findById(userId);
    if (!isExist) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    const skip = (page - 1) * limit;
    const allReport = await ScamReport.find({ userId }).populate('scamType').populate('serviceCategory')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalReports = await ScamReport.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalReports,
      totalPages: Math.ceil(totalReports / limit),
      allReport,
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};
exports.deleteReport = async (req, res) => {
  const id = req.params.id
  try {
    const isExist = await ScamReport.findById(id)
    if (!isExist) return res.status(200).json({ message: "Report not found" })
    safeUnlink(isExist.image)
    await ScamReport.findByIdAndDelete(id)
    return res.status(200).json({ message: "Report deleted", success: true })
  } catch (error) {
    return res.status(200).json({ message: "Server error" })
  }
}
exports.dashboardData = async (req, res) => {
  const id = req.params.id
  try {
    const isExist = await User.findById(id)
    if (!isExist) return res.status(200).json({ message: "User not found" })
    const totalPosting = await ScamReport.countDocuments({ userId: id })
    const totalPromotion = await Advertisement.countDocuments({ userId: id, status: 'live' })
    const openDispute = await OpenDispute.countDocuments({ userId: id, status: 'pending' })
    return res.status(200).json({ message: "Report deleted", success: true, totalPosting, totalPromotion, openDispute })
  } catch (error) {
    return res.status(200).json({ message: "Server error" })
  }
}
exports.purchaseHistory = async (req, res) => {
  const userId = req.params.id;
  let { page = 1, limit = 10, type } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const skip = (page - 1) * limit;

    // ----------------------------------------------------
    // SERVICE HISTORY ONLY (Request + Dispute)
    // ----------------------------------------------------
    if (type === "service") {
      const totalRequest = await RequestBespoke.countDocuments({ userId });
      const totalDispute = await OpenDispute.countDocuments({ userId });
      const totalPurchase = totalRequest + totalDispute;

      const disputeHistory = await OpenDispute.find({ userId })
        .populate("addOnId");
      const requestHistory = await RequestBespoke.find({ userId })
        .populate("addOnId");

      const mergedHistory = [...disputeHistory, ...requestHistory]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const paginatedHistory = mergedHistory.slice(skip, skip + limit);

      return res.status(200).json({
        success: true,
        message: "Service purchase history fetched successfully",
        page,
        limit,
        totalPurchase,
        totalPages: Math.ceil(totalPurchase / limit),
        data: paginatedHistory,
      });
    }

    // ----------------------------------------------------
    // FULL PURCHASE HISTORY (Membership + Service)
    // ----------------------------------------------------

    // Counts
    const totalMembership = await BuyMembership.countDocuments({ userId });
    const totalRequest = await RequestBespoke.countDocuments({ userId });
    const totalDispute = await OpenDispute.countDocuments({ userId });

    const totalCombined = totalMembership + totalRequest + totalDispute;

    // Fetch all data (unpaginated)
    const membershipHistory = await BuyMembership.find({ userId }).populate('transactionId','amount customId')
      .populate("membershipId");

    const disputeHistory = await OpenDispute.find({ userId }).populate('transactionId','amount customId')
      .populate("addOnId");

    const requestHistory = await RequestBespoke.find({ userId }).populate('transactionId','amount customId')
      .populate("addOnId");

    // Merge all
    const mergedHistory = [
      ...membershipHistory,
      ...disputeHistory,
      ...requestHistory
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const paginatedHistory = mergedHistory.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      message: "Full purchase history fetched successfully",
      page,
      limit,
      totalPurchase: totalCombined,
      totalPages: Math.ceil(totalCombined / limit),
      data: paginatedHistory,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




exports.getScamReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', type = '', scamType = '', status } = req.query;
    const searchConditions = [];
    if (search) {
      searchConditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (type) {
      searchConditions.push({ format: type });
    }
    if (status !== 'all') {
      searchConditions.push({ status: status });
    }
    if (scamType) {
      searchConditions.push({ scamType });
    }
    const searchFilter = searchConditions.length > 0 ? { $and: searchConditions } : {};
    const totalScams = await ScamReport.countDocuments(searchFilter);
    const scams = await ScamReport.find(searchFilter)
      .sort({ createdAt: -1 })
      .populate("scamType")
      .populate("serviceCategory")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalScams / limit),
      totalScams,
      scams
    });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ success: false, error: err.message });
  }
};
exports.getScamBook = async (req, res) => {
  const { email } = req.body
  try {
    // const isExist=await BookCustomer.findOne({email})
    // if(isExist){
    //   return res.status(200).json({message:"You already get scam book",success:false})
    // }
    const book = await BookCustomer.create({ email });
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:30px;">
    <div style="max-width:600px; margin:auto; background-color:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
      <div style="background-color:#111; padding:20px; text-align:center;">
        <h1 style="color:#fff; margin:0;">The Great Fraud Fightback</h1>
      </div>
      <div style="padding:30px;">
        <p>Hi there,</p>
        <p>Thank you for your interest in <strong><em>The Great Fraud Fightback</em></strong> by Amber Waheed.</p>
        <p>This gripping story reveals the real-life battle against financial deception and offers a roadmap to protect yourself and others from fraud.</p>
        <p>You can download your complimentary copy below:</p>
        <div style="text-align:center; margin:30px 0;">
          <a href="https://api.wizbizlaonboard.com/uploads/scam-book.pdf" 
             style="background-color:#00a859; color:#fff; padding:15px 25px; border-radius:5px; text-decoration:none; font-weight:bold;">
             📘 Download E-Book
          </a>
        </div>
        <p>If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all;">https://api.wizbizlaonboard.com/uploads/scam-book.pdf</p>
        <hr style="margin:30px 0;">
        <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} Wizbizla. All rights reserved.<br>
        You are receiving this email because you signed up for a complimentary e-book sample.</p>
      </div>
    </div>
  </div>`;
    await sendEmail({
      to: email,
      subject: "The Great Fraud Fightback From  Wizbizla!",
      html: htmlContent,
    
    });
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.blogSubscribe = async (req, res) => {
  const { email } = req.body
  try {
    const isExist=await BlogSubscriber.findOne({email})
    if(isExist){
      return res.status(200).json({message:"You already subscribed our blogs",success:false})
    }
    const subscriber = await BlogSubscriber.create(req.body);
    await checkEmail(email,email,'blogSubscribe')
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.podcastSubscribe = async (req, res) => {
  const { name, email, country } = req.body
  try {
    const isExist=await PodcastSubscriber.findOne({email})
    if(isExist){
      return res.status(200).json({message:"You already subscribed our podcast",success:false})
    }
    const subscriber = await PodcastSubscriber.create(req.body);
    await checkEmail(email,name,'podcastSubscribe')
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.contactQuery = async (req, res) => {
  const { name, email, country } = req.body
  try {
    const contact = await Contact.create(req.body);
    await checkEmail(email,name,'contactQuery')
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.feedbackQuery = async (req, res) => {
  const { name, email, country ,userId} = req.body
  try {
    const user=await User.findById(userId)
    const feedback = await Feedback.create(req.body);
    if(user){

    }
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.searchProfile = async (req, res) => {
  const name = req.params.name;
  const { role = '', status = 'live' } = req.query
  try {
    const searchWords = name.split(" ").filter(Boolean);

    const regexConditions = searchWords.map(word => ({
      $or: [
        { firstName: { $regex: word, $options: "i" } },
        { lastName: { $regex: word, $options: "i" } }
      ]
    }));
    const query = { $and: regexConditions, onBoarding: false };

    // Add role condition if provided
    if (role !== '') {
      query.role = role;
    }
    query.status = 'live'
    const users = await User.find(query).limit(10);
    // Fetch profiles in parallel
    const finalUsers = await Promise.all(
      users.map(async (user) => {
        const profileData = await ProviderProfile.findOne({ userId: user._id?.toString() }).lean() || {};
        return {
          ...user.toObject(),
          profileData
        };
      })
    );

    return res.status(200).json({
      success: true,
      profileUsers: finalUsers
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getProviderLocations = async (_req, res) => {
  try {
    const locations = await ProviderProfile.distinct('location', { location: { $exists: true, $ne: "" } });
    const cleaned = locations.filter(Boolean);
    console.log("Provider locations : ", cleaned)
    return res.status(200).json({ success: true, locations: cleaned });
  } catch (err) {
    console.log("Provider locations are not found : ", err)
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getNotifications = async (req, res) => {
  const userId = req.params.id
  try {
    const notifications = await Notifications.find({ userId }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.deleteNotifications = async (req, res) => {
  const id = req.params.id
  try {
    const notifications = await Notifications.findByIdAndDelete(id)

    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchProviders = async (req, res) => {
  const { name = '', location = '', categories = '' } = req.query;
  try {
    let userIdFilter = {};
    if (name && name.trim().length > 0) {
      const searchWords = name.split(" ").filter(Boolean);
      const regexConditions = searchWords.map(word => ({
        $or: [
          { firstName: { $regex: word, $options: "i" } },
          { lastName: { $regex: word, $options: "i" } }
        ]
      }));
      const users = await User.find({ $and: regexConditions, role: 'provider', status: 'live', onBoarding: false }).select('_id');
      const ids = users.map(u => u._id);
      if (ids.length === 0) {
        return res.status(200).json({ success: true, providers: [] });
      }
      userIdFilter.userId = { $in: ids };
    }

    const filter = { ...userIdFilter };
    if (location && location.trim().length > 0) {
      const bizUsers = await ProviderProfile.find({
        location: { $regex: location.trim(), $options: 'i' }
      }).select('userId');
      const bizIds = bizUsers.map(b => b.userId).filter(Boolean);
      if (bizIds.length === 0) {
        return res.status(200).json({ success: true, providers: [] });
      }
      if (filter.userId && filter.userId.$in) {
        const nameIds = filter.userId.$in.map(id => id.toString());
        const inter = bizIds.filter(id => nameIds.includes(id.toString()));
        if (inter.length === 0) {
          return res.status(200).json({ success: true, providers: [] });
        }
        filter.userId = { $in: inter };
      } else {
        filter.userId = { $in: bizIds };
      }
    }
    if (categories && categories.trim().length > 0) {
      filter["categories.category"] = { $in: categories };

    }

    const profiles = await ProviderProfile.find(filter)
      .populate({ path: 'userId', match: { status: 'live', role: 'provider' } })
      .populate('categories.category', 'name')
      .populate('categories.service', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const userIds = profiles.map(p => p.userId?._id).filter(Boolean);
    let emirateMap = {};
    if (userIds.length > 0) {
      const bizProfiles = await ProviderProfile.find({ userId: { $in: userIds } }).select('userId location').lean();
      emirateMap = bizProfiles.reduce((acc, b) => {
        acc[b.userId.toString()] = b.location || '';
        return acc;
      }, {});
    }
    const providers = profiles
      .filter(p => p?.userId)
      .map(p => ({
        _id: p?.userId?._id,
        name: `${p.userId.firstName || ''} ${p.userId?.lastName || ''}`.trim(),
        location: emirateMap[p?.userId?._id.toString()] || '',
        image: p.profileImage || '',
        categories: (p.categories || []).map(c => c?.category?.name).filter(Boolean)
      }));
    return res.status(200).json({ success: true, providers });
  } catch (err) {
    console.log(err)
    console.log("Providers are not found : ", err)
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.viewProfile = async (req, res) => {
  const { userId, viewUserId } = req.body
  try {
    if (userId == viewUserId) {
      return res.status(200).json({ success: true, });
    }
    const contact = await ProfileView.create({ userId, viewUserId });
    return res.status(200).json({ success: true, });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.userViewProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const profileViews = await ProfileView.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      // same viewer ko 1 baar rakho
      {
        $group: {
          _id: "$viewUserId",
          view: { $first: "$$ROOT" }
        }
      },

      { $replaceRoot: { newRoot: "$view" } },
      { $sort: { createdAt: -1 } },
      { $limit: 20 }
    ]);

    await ProfileView.populate(profileViews, [
      { path: "userId", select: "firstName lastName" },
      { path: "viewUserId", select: "firstName lastName" }
    ]);

    const viewerIds = profileViews.map(v => v.viewUserId?._id).filter(Boolean);

    const viewerProfiles = await ProviderProfile.find({
      userId: { $in: viewerIds }
    })
      .populate("categories.category", "name image")
      .populate("categories.service", "name subCat");

    const mergedViews = profileViews.map(v => ({
      ...v,
      viewerProfile:
        viewerProfiles.find(
          p => p.userId.toString() === v.viewUserId?._id?.toString()
        ) || null
    }));

    return res.status(200).json({ success: true, profileViews: mergedViews });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};


exports.bookmarkProfile = async (req, res) => {
  const { userId, bookmarkUser, trackerBookmark, blogBookmark } = req.body
  try {
    if (userId == bookmarkUser) {
      return res.status(200).json({ success: true, });
    }
    const isExist = await BookMarkProfile.findOne({ userId, bookmarkUser, trackerBookmark, blogBookmark })
    if (bookmarkUser) {
      await Notifications.create({ userId, message: "You have bookmarked a service provider." })
    }
    if (trackerBookmark) {
      await Notifications.create({ userId, message: "You have bookmarked a scam report." })
    }
    if (blogBookmark) {
      await Notifications.create({ userId, message: "You have bookmarked a blog." })
    }
    if (isExist) {
      await BookMarkProfile.findByIdAndDelete(isExist._id)
      return res.status(200).json({ success: true, });
    }
    const contact = await BookMarkProfile.create({ userId, bookmarkUser, trackerBookmark, blogBookmark });
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.getBookmarkData = async (req, res) => {
  const userId = req.params.id
  const { type = '' } = req.query
  try {
    const isUser = await User.findById(userId)
    if (!isUser) {
      return res.status(200).json({ success: false, message: "User not found" });
    }
    if (type == '') {
      const bookmarkData = await BookMarkProfile.find({ userId })?.sort({ createdAt: -1 }) || []
      return res.status(200).json({ success: true, bookmarkData });
    }
    else if (type == 'scam') {
      const bookmarks = await BookMarkProfile.find({ userId, trackerBookmark: { $ne: null } })?.sort({ createdAt: -1 })
        .populate('trackerBookmark').lean();
      return res.status(200).json({ success: true, bookmarkData: bookmarks });

    }
    else if (type == 'blog') {
      const bookmarks = await BookMarkProfile.find({ userId, blogBookmark: { $ne: null } })?.sort({ createdAt: -1 })
        .populate('blogBookmark').lean();
      return res.status(200).json({ success: true, bookmarkData: bookmarks });

    } else {
      if (type === 'provider') {
        const bookmarks = await BookMarkProfile.find({ userId })?.sort({ createdAt: -1 })
          .populate({
            path: 'bookmarkUser'
          })
          .lean();

        const providerBookmarks = bookmarks.filter(
          (item) => item?.bookmarkUser?.role === 'provider'
        );
        const bookmarkData = await Promise.all(
          providerBookmarks.map(async (item) => {
            const profileData = await ProviderProfile.findOne({
              userId: item.bookmarkUser._id,
            }).populate('categories.category').populate('categories.service').lean();
            const totalRecommended = await RecommendedUser.countDocuments({ recommendedUser: item?.bookmarkUser?._id })

            return {
              ...item,
              totalRecommended,
              profile: profileData || null,
            };
          })
        );
        return res.status(200).json({ success: true, bookmarkData });
      }
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.recommendUser = async (req, res) => {
  const { userId, recommendedUser } = req.body
  try {
    const isUser = await User.findById(userId)
    if (!isUser) return res.status(200).json({ message: "User not found", status: false })
    const isRecommendedUser = await User.findById(recommendedUser)
    if (!isRecommendedUser) return res.status(200).json({ message: "User not found", status: false })
    const isExist = await RecommendedUser.findOne({ userId, recommendedUser })
    if (isExist) {
      await RecommendedUser.findByIdAndDelete(isExist._id)
      return res.status(200).json({ success: true, });
    }
    const recommended = await RecommendedUser.create({ userId, recommendedUser });
    await Notifications.create({ userId, message: `You have given a Rating by ${isRecommendedUser.firstName + ' ' + isRecommendedUser?.lastName}` })
    await Notifications.create({ userId: recommendedUser, message: `You have received a Rating from  ${isUser.firstName + ' ' + isUser?.lastName}` })
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.getRecommendedData = async (req, res) => {
  const userId = req.params.id
  try {
    const isUser = await User.findById(userId)
    if (!isUser) {
      return res.status(200).json({ success: false, message: "User not found" });
    }
    const recommendedData = await RecommendedUser.find({ userId }) || []
    return res.status(200).json({ success: true, recommendedData });

  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.getRatingReceivedData = async (req, res) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page) || 1; // default page 1
  const limit = parseInt(req.query.limit) || 10; // default 10 items per page
  const skip = (page - 1) * limit;
  try {
    const isUser = await User.findById(userId);
    if (!isUser) {
      return res.status(200).json({ success: false, message: "User not found" });
    }
    const totalCount = await RecommendedUser.countDocuments({ recommendedUser: userId });
    const recommendedData = await RecommendedUser.find({ recommendedUser: userId })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    // Fetch profile data for each recommended user
    const recommendedWithProfiles = await Promise.all(
      recommendedData.map(async (item) => {
        const profile = await ProviderProfile.findOne({ userId: item.userId._id })
          .select('profileImage');
        return {
          ...item.toObject(),
          profile
        };
      })
    );

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      recommendedData: recommendedWithProfiles
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getRatingGivenData = async (req, res) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const isUser = await User.findById(userId);
    if (!isUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const totalCount = await RecommendedUser.countDocuments({ userId });
    const recommendedData = await RecommendedUser.find({ userId })
      .populate('recommendedUser', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Fetch profile data for each recommended user
    const recommendedWithProfiles = await Promise.all(
      recommendedData.map(async (item) => {
        const profile = await ProviderProfile.findOne({ userId: item.recommendedUser._id })
          .select('profileImage idealClientProfile'); // adjust fields as needed
        return {
          ...item.toObject(),
          profile
        };
      })
    );

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      recommendedData: recommendedWithProfiles
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.nextPayment = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get all active or next memberships
    const memberships = await BuyMembership.find({
      userId,
      status: { $in: ['active', 'next'] },
    })
      .sort({ startDate: 1 }) // chronological order
      .populate('membershipId');

    if (!memberships || memberships.length === 0) {
      const member=await BuyMembership.findOne({userId,status:'expired'}).populate('membershipId');
      return res.status(200).json({ success: true, message: "No active or upcoming memberships found" ,
        data: {
        nextPaymentDate:new Date(),
        amount:member?.membershipId?.price?.monthly,
        planType: 'monthly',
        durationDays: 0,
        plan:member?.membershipId
      },
      });
    }

    const activeMembership = memberships.find(m => m.status === 'active');
    const nextMemberships = memberships.filter(m => m.status === 'next');

    let nextPaymentMembership = null;
    if (nextMemberships.length > 0) {
      nextPaymentMembership = nextMemberships.reduce((latest, current) => {
        return new Date(current.endDate) > new Date(latest.endDate) ? current : latest;
      });
    }
    // If no next membership exists, fallback to active one
    else if (activeMembership) {
      nextPaymentMembership = activeMembership;
    }

    if (!nextPaymentMembership || !nextPaymentMembership.membershipId) {
      return res.status(404).json({ success: false, message: "Membership plan details not found" });
    }

    const plan = nextPaymentMembership.membershipId;
    // Calculate next payment date
    const nextPaymentDate =
      (nextPaymentMembership.status === 'next' || nextPaymentMembership.status === 'active')
      && nextPaymentMembership.endDate

    // ✅ Calculate date difference between start and end
    const start = new Date(nextPaymentMembership.startDate);
    const end = new Date(nextPaymentMembership.endDate);
    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // difference in days

    // ✅ Determine amount based on duration
    const amount = diffInDays > 30
      ? plan.price.yearly
      : plan.price.monthly;
    // Optional: also include diffInDays in response for debugging
    return res.status(200).json({
      success: true,
      data: {
        nextPaymentDate,
        amount,
        planType: diffInDays > 30 ? 'yearly' : 'monthly',
        durationDays: diffInDays,
        plan
      },
    });

  } catch (err) {
    console.error('Error fetching next payment:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.giveFeedback = async (req, res) => {
  const { userId, title, rating, feedback, feedbackUser } = req.body;
  try {
    const isExist = await User.findById(userId)
    if (!isExist) return res.status(200).json({ message: "User not found", status: false })
    const isFeedbacUser = await User.findById(feedbackUser)
    if (!isFeedbacUser) return res.status(200).json({ message: "User not found", status: false })
    const isFeedback = await FeedBack.findOne({ userId, feedbackUser })
    if (isFeedback) return res.status(200).json({ message: "Already exist", status: false })

    const newFeedback = await FeedBack.create({ userId, title, rating, feedback, feedbackUser });
    await Notifications.create({ userId: feedbackUser, message: `You have received a ${rating} star Feedback from ${isExist.firstName + ' ' + isExist.lastName}.` })
    return res.status(200).json({ status: true, message: 'Feedback created successfully', data: newFeedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Failed to create feedback', error: error.message });
  }
};
exports.getGivenFeedback = async (req, res) => {
  const userId = req.params.id;
  try {
    const isExist = await User.findById(userId)
    if (!isExist) return res.status(200).json({ message: "User not found", status: false })
    const feedData = await FeedBack.find({ feedbackUser: userId })?.populate({ path: 'userId', select: 'firstName lastName' }).sort({ createdAt: -1 });
    const feedbackWithProfiles = await Promise.all(
      feedData.map(async (item) => {
        const userData = await User.findById(item?.userId?._id)
        const profile = userData.role == 'provider' ? await ProviderProfile.findOne({ userId: item.userId._id })
          .select('profileImage') : await ConsumerProfile.findOne({ userId: item.userId._id })
            .select('profileImage');
        return {
          ...item.toObject(),
          profile
        };
      })
    );
    return res.status(200).json({ status: true, message: 'Feedback fetch successfully', data: feedbackWithProfiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Failed to fetch feedback', error: error.message });
  }
};
exports.getMyGivenFeedback = async (req, res) => {
  const userId = req.params.id;
  let { page, limit } = req.query;

  try {
    const isExist = await User.findById(userId);
    if (!isExist) {
      return res.status(200).json({
        message: "User not found",
        status: false
      });
    }

    let feedData;
    if (page && limit) {
      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;

      feedData = await FeedBack.find({ userId })
        .populate({
          path: "feedbackUser",
          select: "firstName lastName"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    else {
      feedData = await FeedBack.find({ userId })
        .populate({
          path: "feedbackUser",
          select: "firstName lastName"
        })
        .sort({ createdAt: -1 });
    }

    const dataWithProfile = await Promise.all(
      feedData.map(async (item) => {
        const profile = await ProviderProfile.findOne({
          userId: item.feedbackUser._id
        }).select("profileImage");

        return {
          ...item.toObject(),
          profile
        };
      })
    );
    const totalCount = await FeedBack.countDocuments({ userId });
    return res.status(200).json({
      status: true,
      message: "Feedback fetched successfully",
      data: dataWithProfile,
      totalCount,
      page: page ? Number(page) : null,
      limit: limit ? Number(limit) : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch feedback",
      error: error.message
    });
  }
};

//    chat data 
exports.sendMsg = async (req, res) => {
  const { to, from, text } = req.body
  const chatImg = req.files?.['chatImg']?.[0]?.path
  try {
    const isExist = await Chat.findOne({ to, from })
    const user = await User.findById(to)
    const newMsg = await Chat.create({ to, from, text, chatImg });
    if (!isExist) {
      await Notifications.create({ userId: from, message: `You have initiated a chat with ${user?.firstName + ' ' + user?.lastName}` })
    }
    return res.status(200).json({ status: true, message: 'Message Sent' });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Failed to fetch feedback', error: error.message });
  }
}
exports.getMsg = async (req, res) => {
  const { to, from } = req.body;

  try {
    // Find messages from 'from' to 'to' and 'to' to 'from'
    const allMsg = await Chat.find({
      $or: [
        { from, to },
        { from: to, to: from }
      ]
    }).sort({ createdAt: 1 }); // Sort messages by timestamp (ascending for older -> newest)

    // Return messages in the correct order (newest at the top)
    return res.status(200).json({
      status: true,
      message: 'Messages fetched successfully',
      allMsg
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};
exports.myChats = async (req, res) => {
  const userId = req.params.id; // Current user's ID
  try {
    const usersFrom = await Chat.distinct('from', {
      $or: [{ to: userId }]
    });

    const usersTo = await Chat.distinct('to', {
      $or: [{ from: userId }]
    });

    const allUserIds = [...new Set([...usersFrom, ...usersTo])];

    const users = await User.find({
      _id: { $in: allUserIds }
    }).select('firstName lastName role');

    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Chat.findOne({
          $or: [
            { from: userId, to: user._id },
            { from: user._id, to: userId }
          ]
        }).sort({ createdAt: -1 }); // Sort by most recent message
        const profile = user.role === 'consumer' ? await ConsumerProfile.findOne({ userId: user._id }) : await ProviderProfile.findOne({ userId: user._id })

        return {
          user,
          _id: lastMessage ? lastMessage._id : null,
          lastMessage: lastMessage ? lastMessage.text ? lastMessage?.text : 'image' : 'No messages yet',
          createdAt: lastMessage ? lastMessage.createdAt : null,
          isUnRead: !!(
            lastMessage &&
            lastMessage.to.toString() === userId &&
            !lastMessage.read
          ),

          profile
        };
      })
    );

    usersWithLastMessage.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt); // Sort by createdAt
    });

    return res.status(200).json({
      status: true,
      message: 'Fetched chat users and last message successfully',
      users: usersWithLastMessage
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
};

exports.addBilling = async (req, res) => {
  try {
    const newBill = await Billing.create(req.body)
    return res.status(200).json({ status: true, message: 'Billing created' });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Failed to create billing', error: error.message });
  }
}
exports.getAllBilling = async (req, res) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const isUser = await User.findById(userId);
    if (!isUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const totalCount = await Billing.countDocuments({ userId });
    const billingData = await Billing.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      billingData
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getProfileData = async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    let profile = {}
    if (user.role == 'consumer') {
      profile = await ConsumerProfile.findOne({ userId })
    } else if (user.role == 'provider') {
      profile = await ProviderProfile.findOne({ userId })
    }
    const notifications = await Notifications.countDocuments({ userId })
    return res.status(200).json({
      status: true,
      data: profile,
      notifications
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
exports.getListingUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const category = req.query.category || null;
  const subCategory = req.query.subCategory || null;
  const location = req.query.location || null;
  try {
    let filter = {};

    if (category) {
      filter["categories.category"] = category;
    }

    if (subCategory) {
      filter["categories.service"] = { $in: [subCategory] };
    }

    if (location) {
      filter.location = location;
    }
    const totalCount = await ProviderProfile.countDocuments(filter);

    const userData = await ProviderProfile.find(filter)
      .populate({
        path: "userId",
        match: { status: "live" },
        select: "-password"
      })
      .populate("categories.category")
      .populate("categories.service")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const filteredUserData = userData.filter(item => item.userId);
    const userIds = filteredUserData.map(item => item.userId?._id).filter(Boolean);
    const recommendations = await RecommendedUser.aggregate([
      { $match: { recommendedUser: { $in: userIds } } },
      { $group: { _id: "$recommendedUser", total: { $sum: 1 } } }
    ]);

    // Map recommendations to users
    const recommendationsMap = {};
    recommendations.forEach(r => {
      recommendationsMap[r._id.toString()] = r.total;
    });

    const userDataWithRecommendations = filteredUserData.map(item => {
      const userId = item.userId?._id?.toString();
      return {
        ...item.toObject(),
        totalRecommendations: recommendationsMap[userId] || 0
      };
    });

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      userData: userDataWithRecommendations
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.disputeQuery = async (req, res) => {
  try {
    const {
      message,
      subject,
      tokenUsed,
      type,
      against,
      userId,
      addOnPrice,
      addOnId,
      addOnType,
      serviceUsed
    } = req.body;

    const image = req.files?.image?.[0]?.path || null;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ success: false, message: "User does not exist" });
    }
    const againstUser = await User.findById(against);
    if (!againstUser) {
      return res.status(200).json({ success: false, message: "User does not exist" });
    }
    const isAddOn = await AddOnService.findById(addOnId);
    if (!isAddOn) {
      return res.status(404).json({ success: false, message: "service does not exist" });
    }
    if (serviceUsed) {
      if (user.freeService <= 0) {
        return res.status(200).json({
          success: false,
          message: "No free services remaining"
        });
      }
      user.freeService -= 1;
      await user.save();
     
    }
    if (tokenUsed) {
      if (user.monthlyToken <= 0) {
        return res.status(200).json({
          success: false,
          message: "No free services remaining"
        });
      }
      user.monthlyToken -= 1;
      await user.save();
      
    }
    const data = {
      message,
      subject,
      type,
      against,
      userId,
      serviceUsed,
      tokenUsed,
      image,
      addOnPrice,
      addOnId,
      addOnType,
      status: (serviceUsed || tokenUsed) ? "pending" : "payment-pending"
    };

    const dispute = await OpenDispute.create(data);

    if(tokenUsed){
      await Notifications.create({
        userId, message: `You have submitted a Service Dispute, ID ${dispute.customId}, 
      against ${againstUser.firstName + ' ' + againstUser.lastName}`
      })
      await Notifications.create({ userId: against, message: `A Service Dispute, ID ${dispute.customId}, has been raised against you, by  ${user.firstName + ' ' + user.lastName}`, icon: "red" })

      await Notifications.create({ userId, message: "You have used 1 token for this service", icon: "green" })
      await Notifications.create({ userId, message: `You have purchased ${isAddOn?.name}.` })
    }
    if(serviceUsed){
       await Notifications.create({
        userId, message: `You have submitted a Service Dispute, ID ${dispute.customId}, 
      against ${againstUser.firstName + ' ' + againstUser.lastName}`
      })
      await Notifications.create({ userId: against, message: `A Service Dispute, ID ${dispute.customId}, has been raised against you, by  ${user.firstName + ' ' + user.lastName}`, icon: "red" })

      await Notifications.create({ userId, message: "You have used 1 token for this service", icon: "green" })
      await Notifications.create({ userId, message: `You have purchased ${isAddOn?.name}.` })
    }


    return res.status(200).json({ success: true, dispute });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDisputeQuery = async (req, res) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const isUser = await User.findById(userId);
    if (!isUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (req.query.type == 'againstMe') {
      const totalCount = await OpenDispute.countDocuments({ against: userId, status: { $in: ['resolved'] } });
      const pendingCount = await OpenDispute.countDocuments({ against: userId, status: 'pending' })
      const disputeData = await OpenDispute.find({ against: userId, status: { $in: ['resolved'] } }).populate({ path: 'userId', select: '-password' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        disputeData,
        pendingCount
      });
    } else {
      const totalCount = await OpenDispute.countDocuments({ userId, status: { $ne: 'payment-pending' } });
      const pendingCount = await OpenDispute.countDocuments({ userId, status: 'pending' })
      const disputeData = await OpenDispute.find({ userId, status: { $ne: 'payment-pending' } }).populate({ path: 'against', select: '-password' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        disputeData,
        pendingCount
      });
    }

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.bespokeRequestQuery = async (req, res) => {
  try {
    const { userId, tokenUsed, addOnId, serviceUsed, ...rest } = req.body;
    console.log(req.body)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }
    const isAddOn = await AddOnService.findById(addOnId);
    if (!isAddOn) {
      return res.status(404).json({ success: false, message: "service does not exist" });
    }

    if (serviceUsed) {
      if (user.freeService <= 0) {
        return res.status(400).json({
          success: false,
          message: "No free service remaining"
        });
      }
      user.freeService -= 1;
      await user.save();
      await Notifications.create({ userId, message: "You have used 1 token for this service", icon: "green" })
      await Notifications.create({ userId, message: `You have purchased ${isAddOn?.name}.` })

    }
    if (tokenUsed) {
      if (user.monthlyToken <= 0) {
        return res.status(400).json({
          success: false,
          message: "No monthly token remaining"
        });
      }
      user.monthlyToken -= 1;
      await user.save();
      await Notifications.create({ userId, message: "You have used 1 token for this service", icon: "green" })
      await Notifications.create({ userId, message: `You have purchased ${isAddOn?.name}.` })

    }

    const data = {
      ...rest,
      userId,
      serviceUsed,
      addOnId,
      tokenUsed,
      status: (serviceUsed || tokenUsed) ? "pending" : "payment-pending",
    };

    const request = await RequestBespoke.create(data);


    return res.status(200).json({ success: true, request });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendBasket = async (req, res) => {
  const userId = req.params.id
  try {
    const isUser = await User.findById(userId)
    if (!isUser) return res.status(200).json({ message: "User not found", success: false })
    const html = `
  Hi ${isUser.firstName},

Thank you for registering with Wizbizla! We’re excited to let you know that your exclusive Welcome Basket is being prepared and will be delivered to your home soon.

Inside, you’ll find special offers, discounts, and handpicked products from trusted UAE companies—carefully selected to help you discover the best services around you.

We’re thrilled to welcome you to the Wizbizla community. If you have any questions or need assistance, feel free to reach out anytime.

Warm regards,
Team Wizbizla`
    await sendEmail({
      to: isUser.email,
      subject: 'Welcome basket from wizbizla',
      html
    });
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.getRequestServiceQuery = async (req, res) => {
  const userId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const type = req.query.type || null;

  let filter = { userId };
  if (type) {
    filter.type = type;
  }

  try {
    const isUser = await User.findById(userId);
    if (!isUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const totalCount = await RequestBespoke.countDocuments(filter);
    const bespokeData = await RequestBespoke.find(filter).populate('businessCategory').populate('providerId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      bespokeData
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.subscribeNeswsletter = async (req, res) => {
  const { email } = req.body
  try {
    const isExist = await NewsLetter.findOne({ email });
    if (isExist) {
      return res.status(200).json({ success: false, message: "You are already subscribed to our newsletter." });
    }
    const newsletter = await NewsLetter.create({ email });
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}
exports.inviteUserEmail = async (req, res) => {
  const { userId, email, link,name } = req.body
  try {
    const isUser = await User.findById(userId)
    if (!isUser) return res.status(200).json({ message: "User not found", success: false })
  
  await sendEmail.inviteUser(email,isUser.firstName,name,link)
    
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.connectionRequest = async (req, res) => {
  const userId = req.params.id
  try {
    const isUser = await User.findById(userId)
    if (!isUser) return res.status(200).json({ message: "User not found", success: false })
    const connectionRequest = await ProviderFeature.find({
      connection: {
        $elemMatch: {
          userId: userId,
          status: "pending"
        }
      }
    }).populate('userId', 'firstName lastName email');

    const userProfile = await Promise.all(connectionRequest.map(async (item) => {
      const profileData = await ProviderProfile.findOne({ userId: item.userId._id }).select('profileImage title company');

      return {
        ...item.toObject(),
        profileData
      }
    }))
    const myConnection = await ProviderFeature.find({
      connection: {
        $elemMatch: {
          userId: userId,
          status: "accepted"
        }
      }
    }).populate('userId', 'firstName lastName email');

    const myProfile = await Promise.all(myConnection.map(async (item) => {
      const profileData = await ProviderProfile.findOne({ userId: item.userId._id }).select('profileImage title company');

      return {
        ...item.toObject(),
        profileData
      }
    }))

    return res.status(200).json({ success: true, userProfile, myProfile });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}
exports.connectionAction = async (req, res) => {
  const { userId, status, connectedUser } = req.body;

  try {
    const isUser = await User.findById(userId);
    if (!isUser)
      return res.status(200).json({ message: "User not found", success: false });

    const updated = await ProviderFeature.findOneAndUpdate(
      {
        userId: connectedUser,
        "connection.userId": userId
      },
      {
        $set: {
          "connection.$.status": status
        }
      },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Connection not found" });

    if (status === "accepted") {
      await ProviderFeature.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            connection: {
              userId: connectedUser,
              status: "accepted"
            }
          }
        },
        { upsert: true }
      );
    }
    return res.status(200).json({
      success: true,

    });

  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.disputePayment = async (req, res) => {
  const { email, cardInformation, phoneNumber, zipCode, country, disputeId,price } = req.body
  const image = req.files?.['image']?.[0]?.path
  try {
    const isDispute = await OpenDispute.findById(disputeId)
    if (!isDispute) return res.status(200).json({ message: "Dispute not found", success: false })
    const user = await User.findById(isDispute.userId);
    const againstUser = await User.findById(isDispute.against);
    const isAddOn = await AddOnService.findById(isDispute.addOnId);
    await Notifications.create({
      userId: isDispute.userId, message: `You have submitted a Service Dispute, ID ${isDispute.customId}, 
      against ${againstUser.firstName + ' ' + againstUser.lastName}`
    })
    await Notifications.create({ userId: againstUser._id, message: `A Service Dispute, ID ${isDispute.customId}, has been raised against you, by  ${user.firstName + ' ' + user.lastName}`, icon: "red" })
    await Notifications.create({ userId: isDispute.userId, message: `You have purchased ${isAddOn?.name}.` })
    const trans=await Transaction.create({userId:isDispute.userId,disputeId,email, cardInformation, phoneNumber, zipCode, country,amount:price || isDispute.price,type:'dispute'})
    if(trans){

      const dispute = await OpenDispute.findByIdAndUpdate(disputeId, {transactionId:trans?._id, status: 'pending' }, { new: true });
    }
    return res.status(200).json({ success: true,  });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.requestPayment = async (req, res) => {
  const { email, cardInformation, phoneNumber, zipCode, country, requestId ,price} = req.body
  try {
    const isDispute = await RequestBespoke.findById(requestId)
    if (!isDispute) return res.status(200).json({ message: "Dispute not found", success: false })

    const isAddOn = await AddOnService.findById(isDispute.addOnId);
    await Notifications.create({ userId: isDispute.userId, message: `You have purchased ${isAddOn?.name}.` })
    const trans=await Transaction.create({userId:isDispute?.userId,bespokeId:requestId
      ,email, cardInformation, phoneNumber, zipCode, country,amount:price || isDispute?.price,type:'bespoke'})
    if(trans){
      const dispute = await RequestBespoke.findByIdAndUpdate(requestId, { transactionId:trans?._id, status: 'pending' }, { new: true });
    }
    return res.status(200).json({ success: true, });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.getLiveAd = async (req, res) => {

  try {
    const isAd = await Advertisement.findOne({ status: "live" }).sort({ createdAt: -1 });
    return res.status(200).json({ message: "Ad  found", success: true, ad: isAd });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ success: false, message: err.message });
  }
};
exports.deleteOrphanChats = async (req, res) => {
  try {
    // 1️⃣ Get all user IDs that exist in User model
    const existingUserIds = await User.find().distinct("_id");

    // 2️⃣ Find all chats where from or to user does NOT exist
    const orphanChats = await Chat.find({
      $or: [
        { from: { $nin: existingUserIds } },
        { to: { $nin: existingUserIds } }
      ]
    });

    // 3️⃣ Delete associated images
    for (let chat of orphanChats) {
      if (chat.chatImg) {
        safeUnlink(chat.chatImg);
      }
    }

    // 4️⃣ Delete orphan chat records
    await Chat.deleteMany({
      $or: [
        { from: { $nin: existingUserIds } },
        { to: { $nin: existingUserIds } }
      ]
    });

    return res.status(200).json({
      status: true,
      message: "Deleted orphan chat records successfully",
      deletedCount: orphanChats.length
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to delete orphan chat records",
      error: error.message
    });
  }
};
exports.readMessage = async (req, res) => {
  const { chatId, from } = req.body;

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, from },      // make sure this matches your schema
      { $set: { read: true } },
      { new: true }
    );

    if (!chat) {
      return res.status(200).json({
        success: false,
        message: "Chat not found or not authorized",
      });
    }

    return res.status(200).json({ success: true, chat });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getAdProvider = async (req, res) => {
  try {
    // 1. Get live ads
    const notifications = await Advertisement.find({
      status: 'live',
      spot: 'HomePageAccredited',
      endDate: { $gte: new Date() }
    })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Extract provider IDs
    const providerIds = notifications
      .map(item => item.userId)
      .filter(Boolean);

    // 3. Get users
    const users = await User.find({ _id: { $in: providerIds } })
      .select('firstName lastName email ')
      .lean();

    // 4. Get provider profiles
    const profiles = await ProviderProfile.find({ userId: { $in: providerIds } })
      .populate('categories.category')
      .populate('categories.service')
      .lean();

    // 5. Get recommendations count
    const recommendations = await RecommendedUser.aggregate([
      { $match: { recommendedUser: { $in: providerIds } } },
      { $group: { _id: "$recommendedUser", count: { $sum: 1 } } }
    ]);

    // 6. Merge everything
    const result = providerIds.map(providerId => {
      return {
        user: users.find(u => u._id.toString() === providerId.toString()),
        profile: profiles.find(p => p.userId.toString() === providerId.toString()),
        recommendations:
          recommendations.find(r => r._id.toString() === providerId.toString())?.count || 0
      };
    });

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.mailChecker = async (req, res) => {
  try {
    await checkEmail(
      "madhusudhandivanextechnologies@gmail.com",
      "Ahmed",
      "podcastSubscribe"
    );
    return res.status(200).json({ message: "succes" })
  } catch (error) {
    console.log(error)
    return res.status(200).json({ message: error })

  }
}