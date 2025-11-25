const Profile = require('../models/profile.model');
const ConsumerProfile = require('../models/Consumer/Profile');
const User = require('../models/user.model');

// exports.createOrUpdateProfile = async (req, res) => {
//     try {
//         const {
//             name,
//             title,
//             company,
//             location,
//             avatar,
//             idealClientProfile,
//             categories
//         } = req.body;

//         const userId = req.user.userId;

//         // Check if profile exists
//         let profile = await Profile.findOne({ user: userId });

//         const profileData = {
//             userId: userId,
//             name,
//             title,
//             company,
//             location,
//             avatar,
//             idealClientProfile,
//             bannerImage: req.files?.['bannerImage']?.[0]?.path || '',
//             profileImage: req.files?.['profileImage']?.[0]?.path || '',
//             videoIntro: req.files?.['videoIntro']?.[0]?.path || '',
//             categories: JSON.parse(categories)
//         };

//         if (profile) {
//             // Update existing
//             profile = await Profile.findOneAndUpdate({ user: userId }, profileData, { new: true });
//         } else {
//             // Create new
//             profile = new Profile(profileData);
//             await profile.save();
//         }

//         res.status(200).json({ success: true, data: profile });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// };
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const {
            name,
            title,
            company,
            location,
            avatar,
            idealClientProfile,
            categories,
            type
        } = req.body;

        const userId = req.user.userId;

        // Check if profile exists
        let profile = await Profile.findOne({ userId: userId }); // Changed from 'user' to 'userId'

        // Parse categories if it's a string, otherwise use as-is
        let categoriesData = categories;
        if (typeof categories === 'string') {
            categoriesData = JSON.parse(categories);
        }

        // Map services to service for your schema
        const mappedCategories = categoriesData.map(cat => ({
            category: cat.category,
            service: cat.services || cat.service || [] // Handle both 'services' and 'service'
        }));

        const profileData = {
            userId: userId,
            name,
            title,
            company,
            location,
            avatar,
            type,
            idealClientProfile,
            bannerImage: req.files?.['bannerImage']?.[0]?.path || profile?.bannerImage || '',
            profileImage: req.files?.['profileImage']?.[0]?.path || profile?.profileImage || '',
            videoIntro: req.files?.['videoIntro']?.[0]?.path || profile?.videoIntro || '',
            categories: mappedCategories // Use the mapped categories
        };

        if (profile) {
            // Update existing
            profile = await Profile.findOneAndUpdate(
                { userId: userId },
                profileData,
                { new: true }
            );
        } else {
            // Create new
            profile = new Profile(profileData);
            await profile.save();
        }

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getProfileByUserId = async (req, res) => {
    try {
        const userId = req.user.userId 

        const profile = await Profile.findOne({ userId: userId }).populate('categories.category')   // populate the main category inside each subdoc
            .populate('categories.service');;
        

        if (!profile ) {
            
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.status(200).json({ success: true, data: profile ||cProfile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getProfileByAdmin = async (req, res) => {
    try {
        // const requester = req.user; // From JWT
        const userId = req.params.id;
        // Check if requester is admin
        // if (requester.role !== 'admin') {
        //     return res.status(403).json({ success: false, message: 'Access denied' });
        // }

        // Optional: Validate user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const profile = await Profile.findOne({ userId: userId })
            .populate('categories.category')
            .populate('categories.service');;

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.status(200).json({ success: true, data: profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
