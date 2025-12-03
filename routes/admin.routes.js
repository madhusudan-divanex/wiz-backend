const express = require('express');
const { loginAdmin, getAdminProfile, getMembershipData, createAddOn, getAddOn, getAddOnData, updateAddOn, deleteAddOn, getAllUsers, getAllPurchaseMembership, createCategory, updateCategory, getCategory, getCategoryData, deleteCategory, getAllDeletedUsers, getAllBookCustomer, getPodcastSubscriber, getContactQuery, approveProfile, createSubCategory, getSubCategory, deleteSubCategory, updateSubCategory, getSubCategoryData, reportAction, getAllAds, adAction, getAllReferences, referenceAction, shareMicWithUs, scamData, getAllServiceDispute, getAllFeedback, getRequestedService, disputeAction, serviceAction, newsLetter } = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { deleteMembership } = require('../controllers/admin.controller');
const { updateMembership } = require('../controllers/admin.controller');
const { addMembership } = require('../controllers/admin.controller');
const { getMembership } = require('../controllers/admin.controller');
const getUploader = require('../config/multerConfig');
const { getScamReports, feedbackQuery, connectionAction } = require('../controllers/user.controller');
const router = express.Router();
const uploader = getUploader('frontend');

router.post('/admin-login', loginAdmin);
router.get('/admin-profile',authMiddleware, getAdminProfile);
router.post('/add-membership',authMiddleware, addMembership);
router.get('/get-membership', getMembership);
router.get('/get-membership-data/:id',authMiddleware, getMembershipData);
router.put('/update-membership',authMiddleware, updateMembership);
router.delete('/delete-membership/:id',authMiddleware, deleteMembership);
router.post('/create-addon',authMiddleware, createAddOn);
router.get('/get-addon', getAddOn);
router.get('/get-addon-data/:id',authMiddleware, getAddOnData);
router.put('/update-addon',authMiddleware, updateAddOn);
router.delete('/delete-addon/:id',authMiddleware, deleteAddOn);
router.get('/get-all-users',authMiddleware, getAllUsers);
router.get('/get-all-deleted-users',authMiddleware, getAllDeletedUsers);
router.get('/get-all-purchase-membership',authMiddleware, getAllPurchaseMembership);
router.post('/create-category',uploader.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]),authMiddleware, createCategory);
router.put('/update-category',uploader.fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 },
  ]),authMiddleware, updateCategory);
router.get('/get-category', getCategory);
router.get('/get-category-data/:id', getCategoryData);
router.delete('/delete-category/:id',authMiddleware, deleteCategory);

router.post('/create-subcategory',authMiddleware, createSubCategory);
router.put('/update-subcategory',authMiddleware, updateSubCategory);
router.get('/get-subcategory',authMiddleware, getSubCategory);
router.get('/get-subcategory-data/:id',authMiddleware, getSubCategoryData);
router.delete('/delete-subcategory/:id',authMiddleware, deleteSubCategory);

router.get('/get-report-scam', getScamReports);
router.get('/get-scam/:id', scamData);
router.get('/get-book-customers',authMiddleware, getAllBookCustomer);
router.get('/get-podcast-subscribers',authMiddleware, getPodcastSubscriber);
router.get('/get-contact-query',authMiddleware, getContactQuery);
router.get('/get-service-dispute',authMiddleware, getAllServiceDispute);
router.get('/get-feedback',authMiddleware, getAllFeedback);
router.get('/requested-service',authMiddleware, getRequestedService);
router.post('/dispute-action',authMiddleware, disputeAction);


router.post('/profile-action',authMiddleware, approveProfile);
router.post('/report-action',authMiddleware, reportAction);
router.get('/ads',authMiddleware, getAllAds);
router.get('/trusted-reference',authMiddleware, getAllReferences);
router.post('/ad-action',authMiddleware, adAction);
router.post('/reference-action',authMiddleware, referenceAction);
router.post('/share-mic', shareMicWithUs);
router.post('/feedback', feedbackQuery);
router.post('/service-action',authMiddleware, serviceAction);
router.get('/newsletter', newsLetter);


module.exports = router;