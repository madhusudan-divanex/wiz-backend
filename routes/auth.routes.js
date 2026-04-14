const express = require('express');
const router = express.Router();
const { createUser, loginUser,getProfile, verifyOtp, resendOtp, forgotEmail, resetPassword, signUpUser, signInUser, changePassword, updateUser } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/profile', authMiddleware, getProfile)
router.post('/sign-up', signUpUser)
router.post('/sign-in', signInUser)
router.post('/verify-otp',verifyOtp)
router.get('/resend-otp/:id',resendOtp)
router.get('/forgot-password/:email',forgotEmail)
router.post('/reset-password',resetPassword)
router.put('/update-user',authMiddleware,updateUser)
router.post('/change-password',authMiddleware,changePassword)
module.exports = router;