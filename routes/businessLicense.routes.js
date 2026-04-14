const express = require('express');
const router = express.Router();
const getUploader = require('../config/multerConfig');
const authMiddleware = require('../middlewares/auth.middleware');
const { createBusinessLicense,getBusinessLicenseByUserId } = require('../controllers/businessLicense.controller');
const upload = getUploader('general');

router.post('/',authMiddleware, upload.any(),createBusinessLicense);
router.get('/admin-licence-get/:id', getBusinessLicenseByUserId);
module.exports = router;
