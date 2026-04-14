const express = require('express');
const router = express.Router();
const { createOrUpdateProfile,getProfileByUserId ,getProfileByAdmin} = require('../controllers/profile.controller');
const getUploader = require('../config/multerConfig');
const authMiddleware = require('../middlewares/auth.middleware');
const uploader = getUploader('general');

router.post(
  '/',
  authMiddleware,
  uploader.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'videoIntro', maxCount: 1 }
  ]),
  createOrUpdateProfile
);
router.get('/profile-get', authMiddleware, getProfileByUserId);
router.get('/admin-profile-get/:id', getProfileByAdmin);
module.exports = router;
