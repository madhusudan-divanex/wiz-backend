const express = require('express');
const router = express.Router();
const { createFeatures, getFeatures,getFeaturesByUserId } = require('../controllers/feature.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, createFeatures); // Save form data
router.get('/', getFeatures); // Fetch all
router.get('/get/:id', getFeaturesByUserId); // Fetch all
module.exports = router;
