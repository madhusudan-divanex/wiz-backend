const express = require('express');
const { createUseradmin, getAllUsers, getUserById, updateUser,deleteUser, buyMembership, deleteUserWithReason, upgradeMembership, cancelMembership, createScamReport, getScamReports, getScamBook, podcastSubscribe, contactQuery, searchProfile, viewProfile, userViewProfile, bookmarkProfile, getBookmarkData, getRecommendedData, recommendUser, downgradeMembership, nextPayment, userScamReport, deleteReport, dashboardData, purchaseHistory, getRatingReceivedData, getRatingGivenData, getGivenFeedback, giveFeedback, getMyGivenFeedback, sendMsg, getMsg, myChats, addBilling, getAllBilling, getProfileData, getListingUser, getTopProviders, disputeQuery, getDisputeQuery, bespokeRequestQuery, sendBasket, getRequestServiceQuery, subscribeNeswsletter, inviteUserEmail, connectionRequest, connectionAction, disputePayment, requestPayment } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { getUserProfile } = require('../controllers/auth.controller');
const getUploader = require('../config/multerConfig');
const router = express.Router();
const uploader = getUploader('provider');

router.post('/add', createUseradmin);
router.get('/all', getAllUsers);
router.get('/profile', authMiddleware, getUserProfile)
router.get('/profile-data/:id', authMiddleware, getProfileData)
router.get('/listing-provider',authMiddleware, getListingUser)
router.get('/top-provider', getTopProviders)
router.get('/:id', getUserById);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.post('/delete-user',authMiddleware, deleteUserWithReason)
router.post('/buy-membership',authMiddleware, buyMembership);
router.post('/cancel-membership',authMiddleware, cancelMembership);
router.post('/upgrade-membership',authMiddleware, upgradeMembership);
router.post('/downgrade-membership',authMiddleware, downgradeMembership);

router.post('/report-scam',uploader.fields([
    { name: 'image', maxCount: 1 }
  ]),createScamReport);
router.post('/scam-book',getScamBook);
router.post('/podcast-subscribe',podcastSubscribe);
router.post('/contact',contactQuery);
router.get('/search-profile/:name',searchProfile);
router.post('/view-profile',authMiddleware,viewProfile);
router.post('/bookmark-profile',authMiddleware,bookmarkProfile);
router.get('/bookmark/:id',authMiddleware,getBookmarkData);
router.get('/view-profile/:id',authMiddleware,userViewProfile);
router.post('/recommend-user',authMiddleware,recommendUser);
router.get('/recommended/:id',authMiddleware,getRecommendedData);
router.get('/rating-received/:id',authMiddleware,getRatingReceivedData);
router.get('/rating-given/:id',authMiddleware,getRatingGivenData);
router.post('/feedback',authMiddleware,giveFeedback);
router.get('/my-feedback/:id',authMiddleware,getGivenFeedback);
router.get('/my-given-feedback/:id',authMiddleware,getMyGivenFeedback);

router.get('/next-pay/:id',authMiddleware,nextPayment);
router.get('/my-scam-report/:id',authMiddleware,userScamReport);
router.delete('/delete-report/:id',authMiddleware,deleteReport);
router.get('/dashboard/:id',authMiddleware, dashboardData)
router.get('/purchase-history/:id',authMiddleware, purchaseHistory)

router.post('/send-msg',uploader.fields([
    { name: 'chatImg', maxCount: 1 }
  ]),authMiddleware, sendMsg)
router.post('/chat',authMiddleware, getMsg)
router.get('/my-chat/:id',authMiddleware, myChats)

router.post('/billing',authMiddleware, addBilling)
router.get('/billing/:id',authMiddleware, getAllBilling)

router.post('/open-dispute',uploader.fields([
    { name: 'image', maxCount: 1 }]),authMiddleware, disputeQuery)
router.post('/dispute-payment',authMiddleware, disputePayment)
router.post('/request-payment',authMiddleware, requestPayment)


router.get('/my-dispute/:id',authMiddleware, getDisputeQuery)
router.post('/request-bespoke',authMiddleware, bespokeRequestQuery)
router.get('/request-bespoke/:id',authMiddleware, getRequestServiceQuery)

router.post('/send-basket/:id',authMiddleware, sendBasket)
router.post('/subscribe-newsletter',subscribeNeswsletter)
router.post('/invite-user',inviteUserEmail)
router.get('/connection-request/:id',authMiddleware,connectionRequest)
router.post('/connection-action',authMiddleware,connectionAction)


module.exports = router;