const express = require('express');
const { addMarketing,getMarketingByUserId } = require('../controllers/marketing.controller');
const router = express.Router();
const getUploader = require('../config/multerConfig');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = getUploader('general')
router.post(
    '/add-marketing',
   upload.fields([
        { name: 'imageUrl', maxCount: 10 },     // portfolio images
        { name: 'videoIntro', maxCount: 1 },    // video intro
        { name: 'galleryImages_0', maxCount: 10 }, // gallery section 1
        { name: 'galleryImages_1', maxCount: 10 }, // gallery section 2
        { name: 'galleryImages_2', maxCount: 10 }  // gallery section 3
    ]),
    authMiddleware,
    addMarketing
);
router.get('/admin/get-marketing/:userId', getMarketingByUserId);

module.exports = router;

