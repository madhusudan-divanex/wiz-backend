const jwt = require('jsonwebtoken');
const Membership = require('../models/membership.model');
const User = require('../models/user.model');
const BuyMembership = require('../models/buymembership.model');
const Addon = require('../models/addOnServices.model');
const Category = require('../models/FrontEnd/Category.model');
const SubCategory = require('../models/FrontEnd/SubCategory.model');
const DeleteUser= require('../models/deleteUser.model')
const safeUnlink = require('../utils/globalFuntion');
const BookCustomer = require('../models/BookCustomer');
const PodcastSubscriber = require('../models/PodcastSubscriber');
const Contact = require('../models/Contact');
const ScamReport = require('../models/ScamReport');
const Advertisement = require('../models/Provider/providerAdvertisement.model');
const Reference = require('../models/Provider/providerReferences.model');
const ShareMic=require('../models/ShareMic');
const OpenDispute = require('../models/OpenDispute');
const Feedback = require('../models/Feedback');
const RequestBespoke = require('../models/RequestBespoke');
const BookmarkModel = require('../models/Bookmark.model');
const NewsLetter = require('../models/NewsLetter');


exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // const isExist = await User.findOne({ email });
        // if (!isExist) return res.status(200).json({ message: 'User not Found',status:false });
        // const hashedPassword=isExist.password
        // const isMatch = await bcrypt.compare(password,hashedPassword);
        // if (!isMatch) return res.status(200).json({ message: 'Invalid email or password',status:false });
  
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { user: email },
                process.env.JWT_SECRET,
                { expiresIn:  "1d" }
            );
            return res.status(200).json({message:"Login success",status:true,token})
        }
        return res.status(200).json({ message: "Invalid credentials", status: false })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

exports.getAdminProfile = async (req, res) => {
    try {
        
        res.status(200).json({
            status: true,
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
exports.addMembership = async (req, res) => {
    const {btnText,type,name,description,topChoice}=req.body
    const features=JSON.parse(req.body.features)
    const price= JSON.parse(req.body.price)
    try {
        const getMemberShip=await Membership.findOne({name})
        if(getMemberShip){
            return res.status(200).json({message:"Membership already exists with this name",status:false})
        }
        const newData=await Membership.create({btnText,topChoice,type,name,description,features,price})
        if(newData){
            return res.status(200).json({message:"Membership created",status:true})
        }else{
            res.status(200).json({
                status: false,
                message:"Membership not created"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.getMembership = async (req, res) => {
    try {
        const type=req.query.type
        let getMemberShip=[]
        if(type){
            getMemberShip=await Membership.find({type}) || []
        }else{
            getMemberShip=await Membership.find() || []
        }
        res.status(200).json({
            status: true,
            membershipData:getMemberShip
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
exports.getMembershipData = async (req, res) => {
    const id=req.params.id
    try {
        const getMemberShip=await Membership.findById(id) || {}
        return res.status(200).json({
            status: true,
            membershipData:getMemberShip
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.updateMembership = async (req, res) => {
    const {btnText,membershipId,type,name,description,topChoice}=req.body
    const features=JSON.parse(req.body.features)
    const price= JSON.parse(req.body.price)
    try {
        const getMemberShip=await Membership.findById(membershipId)
        if(!getMemberShip){
            return res.status(200).json({message:"Membership not exists",status:false})
        }
        const updateData=await Membership.findByIdAndUpdate(membershipId,{btnText,type,price,features,name,description,topChoice},{update:true})
        if(updateData){
            return res.status(200).json({message:"Membership updated",status:true})
        }else{
            res.status(200).json({
                status: false,
                message:"Membership not updated"
            });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.deleteMembership = async (req, res) => {
    const id=req.params.id
    try {
        const getMemberShip=await Membership.findById(id)
        if(getMemberShip){
            await Membership.findByIdAndDelete(id)
            return res.status(200).json({message:'Membership deleted',status:true})
        }
        return res.status(200).json({
            status: false,
            message:"Membership not found!"
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

//      Add On Services 
exports.createAddOn = async (req, res) => {
    const {price,type,name,description}=req.body
    try {
        const getMemberShip=await Addon.findOne({name})
        if(getMemberShip){
            return res.status(200).json({message:"Add on already exists with this name",status:false})
        }
        const newData=await Addon.create({price,type,name,description})
        if(newData){
            return res.status(200).json({message:"Add on created",status:true})
        }else{
            res.status(200).json({
                status: false,
                message:"Addon not created"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.getAddOn = async (req, res) => {
    try {
        const addonData=await Addon.find() || []
        
        return res.status(200).json({
            status: true,
            addOnData:addonData
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
exports.getAddOnData = async (req, res) => {
    const id=req.params.id
    try {
        const getAddOn=await Addon.findById(id) || {}
        return res.status(200).json({
            status: true,
            addOnData:getAddOn
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.updateAddOn = async (req, res) => {
    const {addOnId,price,type,name,description}=req.body
    try {
        const getAddOn=await Addon.findById(addOnId)
        if(!getAddOn){
            return res.status(200).json({message:"Add on not exists",status:false})
        }
        const updateData=await Addon.findByIdAndUpdate(addOnId,{price,type,name,description},{update:true})
        if(updateData){
            return res.status(200).json({message:"Add on updated",status:true})
        }else{
            res.status(200).json({
                status: false,
                message:"Add on not updated"
            });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.deleteAddOn = async (req, res) => {
    const id=req.params.id
    try {
        const getAddOn=await Addon.findById(id)
        if(getAddOn){
            await Addon.findByIdAndDelete(id)
            return res.status(200).json({message:'Add on deleted',status:true})
        }
        return res.status(200).json({
            status: false,
            message:"Add on not found!"
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
//      Category and sub category 
exports.createCategory = async (req, res) => {
    const {name}=req.body
    const subCat=JSON.parse(req.body.subCat)
    const image=req.files?.['image']?.[0]?.path
    const icon=req.files?.['icon']?.[0]?.path
    try {
        const subCatLabels = subCat.map(item => item.value);
        const isExist=await Category.findOne({name})
        if(isExist){
            return res.status(200).json({message:"Category already exists with this name",status:false})
        }
        const newData=await Category.create({name,image,icon,subCat:subCatLabels})
        if(newData){
            return res.status(200).json({message:"Category created",status:true})
        }else{
            res.status(200).json({
                status: false,
                message:"Category not created"
            });
        }
    } catch (err) {
        safeUnlink(image)
        console.log(err)
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const { page, limit, search = '', type = '' } = req.query;

        // Base query
        let query = {};

        // Add search filter if provided
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Add type filter if provided
        if (type) {
            query.type = type;
        }

        // If no query params (page, limit, search, type) -> return full data
        const hasQueryParams = page || limit || search || type;

        let addonData;
        let totalCategory;

        if (!hasQueryParams) {
            // Return full list (no pagination)
            addonData = await Category.find(query).populate('subCat').sort({ name: 1 });
            totalCategory = addonData.length;
        } else {
            // Paginated result
            const currentPage = parseInt(page) || 1;
            const pageLimit = parseInt(limit) || 10;

            totalCategory = await Category.countDocuments(query);
            addonData = await Category.find(query)
                .populate('subCat')
                .sort({ name: 1 })
                .skip((currentPage - 1) * pageLimit)
                .limit(pageLimit);
        }

        return res.status(200).json({
            status: true,
            categoryData: addonData,
            currentPage: page ? parseInt(page) : 1,
            totalPages: limit ? Math.ceil(totalCategory / limit) : 1,
            totalCategory,
        });
    } catch (err) {
        console.error("Error in getCategory:", err);
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getCategoryData = async (req, res) => {
    const id=req.params.id
    try {
        const getCategory=await Category.findById(id).populate('subCat') || {}
        return res.status(200).json({
            status: true,
            categoryData:getCategory
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    const {name,catId}=req.body
    const subCat=JSON.parse(req.body.subCat)
    const image=req.files?.['image']?.[0]?.path
    const icon=req.files?.['icon']?.[0]?.path
    try {
        const subCatLabels = subCat.map(item => item.value);       
        const getCategory=await Category.findById(catId)
        if(!getCategory){
            return res.status(200).json({message:"Category not exists",status:false})
        }
        const data={name,subCat:subCatLabels}
        if(image){
            data.image=image
            safeUnlink(getCategory.image)
        }
        if(icon){
            data.icon=icon
            safeUnlink(getCategory.icon)
        }
        const updateData=await Category.findByIdAndUpdate(catId,data,{new:true})
        if(updateData){
            return res.status(200).json({message:"Category updated",status:true})
        }else{
            return res.status(200).json({
                status: false,
                message:"Category not updated"
            });
        }
    } catch (err) {
        safeUnlink(image)
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const id=req.params.id
    try {
        const getCategory=await Category.findById(id)
        if(getCategory){
            safeUnlink(getCategory.image)
            await Category.findByIdAndDelete(id)
            return res.status(200).json({message:'Category deleted',status:true})
        }
        return res.status(200).json({
            status: false,
            message:"Category not found!"
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
exports.createSubCategory = async (req, res) => {
    const {name}=req.body
    try {
        const isExist=await SubCategory.findOne({name})
        if(isExist){
            return res.status(200).json({message:"Sub Category already exists with this name",status:false})
        }
        const newData=await SubCategory.create({name})
        if(newData){
            return res.status(200).json({message:"Sub Category created",status:true})
        }else{
            res.status(200).json({
                status: false,
                message:"Sub Category not created"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.getSubCategory = async (req, res) => {
    try {
        const { page, limit=10, search = '', type = '' } = req.query;

        let subCategories;
        let totalSubCategory;

        // If page or limit query exists → apply pagination
        if (page && limit) {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            totalSubCategory = await SubCategory.countDocuments();
            subCategories = await SubCategory.find()
                .sort({ name: 1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum);
            
            return res.status(200).json({
                status: true,
                categoryData: subCategories,
                currentPage: pageNum,
                totalPages: Math.ceil(totalSubCategory / limitNum),
                totalSubCategory,
            });
        }

        // If no pagination query → return full data
        subCategories = await SubCategory.find().sort({ name: 1 });
        totalSubCategory = subCategories.length;

        return res.status(200).json({
            status: true,
            categoryData: subCategories,
            totalSubCategory,
        });

    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getSubCategoryData = async (req, res) => {
    const id=req.params.id
    try {
        const getSubCategory=await SubCategory.findById(id) || {}
        return res.status(200).json({
            status: true,
            categoryData:getSubCategory
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.updateSubCategory = async (req, res) => {
    const {name,subCatId}=req.body
    try {     
        const getSubCategory=await SubCategory.findById(subCatId)
        if(!getSubCategory){
            return res.status(200).json({message:"Sub Category not exists",status:false})
        }
        
        const updateData=await SubCategory.findByIdAndUpdate(subCatId,{name},{new:true})
        if(updateData){
            return res.status(200).json({message:"Sub Category updated",status:true})
        }else{
            return res.status(200).json({
                status: false,
                message:"Sub Category not updated"
            });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.deleteSubCategory = async (req, res) => {
    const id=req.params.id
    try {
        const getSubCategory=await SubCategory.findById(id)
        if(getSubCategory){
            await SubCategory.findByIdAndDelete(id)
            return res.status(200).json({message:'Sub Category deleted',status:true})
        }
        return res.status(200).json({
            status: false,
            message:"Sub Category not found!"
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' ,type='',status=''} = req.query;
       const searchConditions = [];
    if (search) {
      searchConditions.push({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (type) {
      searchConditions.push({ role: type });
    }
    if(status=='pending'){
        searchConditions.push({ status:  {$ne:'live'}  });
    }
    if(status=='provider'){
        searchConditions.push({ status:  'live'  });
    }
    if(status=='license'){
        searchConditions.push({ status: 'tdraft' });
    }
    const searchFilter = searchConditions.length > 0 ? { $and: searchConditions } : {};
    const totalUsers = await User.countDocuments(searchFilter);
    const users = await User.find(searchFilter).select('-password').sort({createdAt:-1})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getAllDeletedUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' ,type=''} = req.query;
       const searchConditions = [];
    if (search) {
      searchConditions.push({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (type) {
      searchConditions.push({ role: type });
    }
    const searchFilter = searchConditions.length > 0 ? { $and: searchConditions } : {};
    const totalUsers = await DeleteUser.countDocuments(searchFilter);
    const users = await DeleteUser.find(searchFilter).select('-password').sort({createdAt:-1})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    return res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
exports.getAllPurchaseMembership = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    // Build dynamic search filter
    const searchFilter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // Count total for pagination
    const totalPurchase = await BuyMembership.countDocuments(searchFilter);

    // Get paginated data
    const purchaseData = await BuyMembership.find(searchFilter).populate({path:'userId',select:'firstName'})
    .populate('membershipId').sort({createdAt:-1})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPurchase / limit),
      totalPurchase,
      purchaseData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
exports.getAllBookCustomer = async (req, res) => {
  try {
    const limit=10
    const {page=1}=req.query
        // Count total for pagination
    const totalPurchase = await BookCustomer.countDocuments();

    // Get paginated data
    const customerData = await BookCustomer.find().sort({createdAt:-1})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPurchase / limit),
      totalPurchase,
      customerData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
exports.getPodcastSubscriber = async (req, res) => {
  try { 
    const {page=1}=req.query
    const limit=10
        // Count total for pagination
    const totalSubscriber = await PodcastSubscriber.countDocuments();

    // Get paginated data
    const subscriberData = await PodcastSubscriber.find().sort({createdAt:-1})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubscriber / limit),
      totalSubscriber,
      subscriberData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
exports.getContactQuery = async (req, res) => {
  try { 
    const {page=1,type}=req.query
    const limit=10
        // Count total for pagination
    const totalQuery = await Contact.countDocuments({type});

    // Get paginated data
    const contactData = await Contact.find({type}).sort({createdAt:-1}).populate('userId')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalQuery / limit),
      totalQuery,
      contactData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
exports.approveProfile = async (req, res) => {
    const {status,userId,isAdmin}=req.body
    try {
        const isUser=await User.findById(userId)
        const data={status}
        const today=new Date()
        if(isAdmin && status=='live'){
            data.approvedOn=today
        }else if (!isAdmin && status=='pending'){
            data.publishedOn=today
        }
        if(isUser){
            const upd=await User.findByIdAndUpdate(userId,data,{new:true})
            return res.status(200).json({
            success: true,
            message:"user profile updated"
        });
        }
        
        return res.status(200).json({
            success: false,
            message:"user not found"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.reportAction = async (req, res) => {
    const {status,reportId}=req.body
    try {
        const isExist=await ScamReport.findById(reportId)
        if (!isExist) return res.status(200).json({message:"Report not found"})
        await ScamReport.findByIdAndUpdate(reportId,{status},{new:true})
        
        return res.status(200).json({
            success: true,
            message:"Report updated"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.scamData = async (req, res) => {
    const id=req.params.id
    const userId=req.query.userId
    try {
        const isBookmark=Boolean(await BookmarkModel.findOne({userId,trackerBookmark:id}))
        const isExist=await ScamReport.findById(id)
        if (!isExist) return res.status(200).json({message:"Report not found"})
        
        return res.status(200).json({
            success: true,
            data:isExist,
            message:"Report found",
            isBookmark
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllAds = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch ads with 'under-review' first
        const ads = await Advertisement.find()
            .sort({
                status: 1, // Sort by status alphabetically: 'expired' < 'live' < 'under-review'
                createdAt: -1
            })
            .skip(skip)
            .limit(limit);

        // Reorder manually to ensure 'under-review' are always first
        const orderedAds = [
            ...ads.filter(ad => ad.status === 'under-review'),
            ...ads.filter(ad => ad.status !== 'under-review')
        ];

        // Get total count for pagination metadata
        const total = await Advertisement.countDocuments();

        res.status(200).json({
            status: true,
            message: 'Advertisements fetched successfully',
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAds: total,
            data: orderedAds
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch advertisements',
            error: error.message
        });
    }
};
exports.getAllReferences = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch ads with 'under-review' first
        const ads = await Reference.find()
            .populate('userId',select='-password')
            .populate('referenceUser',select='-password')
            .sort({
                status: 1, // Sort by status alphabetically: 'expired' < 'live' < 'under-review'
                createdAt: -1
            })
            .skip(skip)
            .limit(limit);

        // Reorder manually to ensure 'under-review' are always first
        const orderedRef = [
            ...ads.filter(ad => ad.status === 'pending'),
            ...ads.filter(ad => ad.status !== 'pending')
        ];

        // Get total count for pagination metadata
        const total = await Reference.countDocuments();

        res.status(200).json({
            status: true,
            message: 'References fetched successfully',
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRef: total,
            data: orderedRef
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch advertisements',
            error: error.message
        });
    }
};
exports.adAction = async (req, res) => {
    const {status,adId}=req.body
    try {
        const isExist=await Advertisement.findById(adId)
        if (!isExist) return res.status(200).json({message:"Report not found"})
        await Advertisement.findByIdAndUpdate(adId,{status},{new:true})
        
        return res.status(200).json({
            success: true,
            message:"Advertisement updated"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.referenceAction = async (req, res) => {
    const {status,refId,comment}=req.body
    try {
        const isExist=await Reference.findById(refId)
        if (!isExist) return res.status(200).json({message:"Report not found"})
        await Reference.findByIdAndUpdate(refId,{status,comment},{new:true})
        
        return res.status(200).json({
            success: true,
            message:"Reference updated"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.shareMicWithUs = async (req, res) => {
    try {
        const data=await ShareMic.create(req.body)
        
        
        return res.status(200).json({
            success: true,
            message:"Request Submited"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllServiceDispute = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const data = await OpenDispute.find()
            .populate('addOnId')
            .populate({path:'against',select:'-password'})
            .populate({path:'userId',select:'-password'})
            .sort({
                status: 1, 
                createdAt: -1
            })
            .skip(skip)
            .limit(limit);
        const total = await OpenDispute.countDocuments();

        return res.status(200).json({
            status: true,
            message: 'Service Dispute fetched successfully',
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAds: total,
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch advertisements',
            error: error.message
        });
    }
};
exports.getAllFeedback = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const data = await Feedback.find()
            .populate({path:'userId',select:'-password'})
            .sort({
                status: 1, 
                createdAt: -1
            })
            .skip(skip)
            .limit(limit);
        const total = await Feedback.countDocuments();

        res.status(200).json({
            status: true,
            message: 'Feedback fetched successfully',
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAds: total,
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch advertisements',
            error: error.message
        });
    }
};
exports.getRequestedService = async (req, res) => {
  try { 
    const {page=1,type}=req.query
    const limit=10
    const totalQuery = await RequestBespoke.countDocuments({type});

    const requestedData = await RequestBespoke.find({type}).sort({createdAt:-1}).populate('userId')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalQuery / limit),
      totalQuery,
      requestedData
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};
exports.disputeAction = async (req, res) => {
    const {status,disputeId,resolution}=req.body
    try {
        const isExist=await OpenDispute.findById(disputeId)
        if (!isExist) return res.status(200).json({message:"Dispute not found"})
        await OpenDispute.findByIdAndUpdate(disputeId,{status,resolution},{new:true})
        
        return res.status(200).json({
            success: true,
            message:"Dispute updated"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.serviceAction = async (req, res) => {
    const {status,serviceId}=req.body
    try {
        const isExist=await RequestBespoke.findById(serviceId)
        if (!isExist) return res.status(200).json({message:"Service not found"})
        await RequestBespoke.findByIdAndUpdate(serviceId,{status},{new:true})
        
        return res.status(200).json({
            success: true,
            message:"Report updated"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.newsLetter = async (req, res) => {
    
    const {page,limit=10}=req.query
    try {
        const data=await NewsLetter.find().sort({createdAt:-1}).skip((page-1)*limit).limit(limit)
        const totalNewsLetter=await NewsLetter.countDocuments();
        
        return res.status(200).json({
            success: true,
            data,
            message:"Newsletter found",
            totalPages:Math.ceil(totalNewsLetter/10)
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};