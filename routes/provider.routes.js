const express = require('express');
const router = express.Router();
const { createOrUpdateProfile,getProfileByUserId, addMarketing, createFeatures, getFeaturesByUserId, getAccerditationByUserId, getMarketingByUserId, createAccerditation, createAd, getAllAds, getAdById, updateAd, deleteAd, addTrustedReference, getTrustedReference, addReference, removeReference, createOrUpdateStayUpdated, getStayUpdatedByUserId, createOrUpdateService, getServiceByUserId, createOrUpdatePreference, getPreferenceByUserId, updateImage, deleteImage, analyticData, individualProfile, getIndividualProfile, businessProfile, getBusinessProfile } = require('../controllers/provider.controller');
const getUploader = require('../config/multerConfig');
const authMiddleware = require('../middlewares/auth.middleware');
const uploader = getUploader('provider');
const upload = getUploader('provider')
router.post(
  '/create-profile',
  authMiddleware,
  uploader.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'videoIntro', maxCount: 1 }
  ]),
  createOrUpdateProfile
);
router.post("/profile-image",uploader.fields([{ name: 'profileImage', maxCount: 1 }]), updateImage);
router.delete("/profile-image/:id",authMiddleware, deleteImage);


router.get('/profile-get/:id',  getProfileByUserId);

router.post(
    '/create-marketing',
   upload.fields([
        { name: 'imageUrl', maxCount: 10 },     // portfolio images
        { name: 'menu', maxCount: 1 },   
        { name: 'videoIntro', maxCount: 1 },
        { name: 'galleryImages_0', maxCount: 10 }, // gallery section 1
        { name: 'galleryImages_1', maxCount: 10 }, // gallery section 2
        { name: 'galleryImages_2', maxCount: 10 }  // gallery section 3
    ]),
    authMiddleware,
    addMarketing
);
router.get('/get-marketing/:id',getMarketingByUserId)

router.post('/create-feature', authMiddleware, createFeatures);
router.get('/get-feature/:id',getFeaturesByUserId) 

router.post('/create-accreditation',authMiddleware, upload.any(),createAccerditation)
router.get('/get-accreditation/:id',getAccerditationByUserId)

// Service
router.post("/service", createOrUpdateService);
router.get("/service/:userId", getServiceByUserId);

// Preference
router.post("/preference", createOrUpdatePreference);
router.get("/preference/:userId", getPreferenceByUserId);

// Stay Updated
router.post("/stayUpdated", createOrUpdateStayUpdated);
router.get("/stayUpdated/:userId", getStayUpdatedByUserId)

router.post('/ads',upload.fields([{ name: 'image', maxCount: 1 }]),authMiddleware, createAd);

router.get('/ads/:id',authMiddleware, getAdById);
router.put('/ads',upload.fields([{ name: 'image', maxCount: 1 }]),authMiddleware, updateAd);
router.delete('/ads/:id',authMiddleware, deleteAd);

router.post('/trusted-reference',authMiddleware,addTrustedReference);
router.get('/trusted-reference/:id',authMiddleware,getTrustedReference);
router.post('/add-reference',authMiddleware,addReference);
router.post('/remove-reference',authMiddleware,removeReference);

router.get('/analytic-data/:id',authMiddleware,analyticData);

router.post('/individual',authMiddleware,individualProfile);
router.get('/individual/:id',authMiddleware,getIndividualProfile);
router.post('/business-profile',authMiddleware,businessProfile);
router.get('/business-profile/:id',authMiddleware,getBusinessProfile);


module.exports = router;
