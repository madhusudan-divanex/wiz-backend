// routes/formRoutes.js
const express =  require('express')
const { createOrUpdateBasket, createOrUpdatePreference, createOrUpdateProfile, createOrUpdateService, createOrUpdateStayUpdated, getBasketByUserId, getPreferenceByUserId, getProfileByUserId, getServiceByUserId, getStayUpdatedByUserId,  updateImage } =  require("../controllers/consumer.controller");
const getUploader = require('../config/multerConfig');


const router = express.Router();
const upload = getUploader('consumer');

// Profile
router.post("/profile", createOrUpdateProfile);
router.post("/profile-image",upload.fields([{ name: 'image', maxCount: 1 }]), updateImage);
router.get("/profile/:userId", getProfileByUserId);

// Basket
router.post("/basket", createOrUpdateBasket);
router.get("/basket/:userId", getBasketByUserId);

// Service
router.post("/service", createOrUpdateService);
router.get("/service/:userId", getServiceByUserId);

// Preference
router.post("/preference", createOrUpdatePreference);
router.get("/preference/:userId", getPreferenceByUserId);

// Stay Updated
router.post("/stayUpdated", createOrUpdateStayUpdated);
router.get("/stayUpdated/:userId", getStayUpdatedByUserId);



module.exports= router;
