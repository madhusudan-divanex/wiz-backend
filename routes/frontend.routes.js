const authMiddleware = require('../middlewares/auth.middleware');
const { contactCMS, getContactCMS, getTips, createTip, updateTip, deleteTip, updateFaq, getAllFaqs, createFaq, deleteFaq, getCategory, createCategory, deleteCategory, updateCategory, createBlog, getBlogs, updateBlog, deleteBlog, getBlogData, createHomeBanner, getHomeBanner, updateHomeBanner, getAllHomeBanners, getHomeBannerById, deleteHomeBanner, createFindResources, getFindResources, getFindResourcesById, updateFindResources, deleteFindResources, createMarketGlance, getMarketGlance, getMarketGlanceById, updateMarketGlance, deleteMarketGlance, createExclusiveMemberships, getExclusiveMemberships, getExclusiveMembershipsById, updateExclusiveMemberships, deleteExclusiveMemberships, createHomeHeader, getHomeHeader, updateHomeHeader, deleteHomeHeader, getTopBlogs } = require('../controllers/frontend.controller');
const express = require('express');
const getUploader = require('../config/multerConfig');
const router = express.Router();
const upload = getUploader('general')
router.post('/contact', authMiddleware, contactCMS)
router.get('/contact', getContactCMS)

router.post('/tip', upload.fields([
    { name: 'image', maxCount: 1 }]), authMiddleware, createTip);
router.get('/tips', getTips);
router.put('/tip', upload.fields([
    { name: 'image', maxCount: 1 }]), authMiddleware, updateTip);
router.delete('/tip/:id', authMiddleware, deleteTip);
router.post("/faq", authMiddleware, createFaq);
router.get("/faq", getAllFaqs);
router.put("/faq", authMiddleware, updateFaq);
router.delete("/faq/:id", authMiddleware, deleteFaq);

router.post('/blog-category', authMiddleware, createCategory);
router.put('/blog-category', authMiddleware, updateCategory);
router.get('/blog-category', getCategory);
router.delete('/blog-category/:id', authMiddleware, deleteCategory);

router.post('/blog', upload.fields([
    { name: 'image', maxCount: 1 }]), authMiddleware, createBlog);
router.get('/blogs', getBlogs);
router.get('/top-blogs', getTopBlogs);
router.get('/blogs', getBlogs);
router.get('/blog-data/:id', getBlogData);

router.put('/blog', upload.fields([
    { name: 'image', maxCount: 1 }]), authMiddleware, updateBlog);
router.delete('/blog/:id', authMiddleware, deleteBlog);

//shubham code
router.post('/create-home-banner', upload.fields([{ name: 'image', maxCount: 1 }]), authMiddleware, createHomeBanner);
router.get('/get-home-banner', getHomeBanner);
router.get('/get-home-banners', getAllHomeBanners);
router.get('/get-home-banner/:id', getHomeBannerById);
router.put('/update-home-banner', upload.fields([{ name: 'image', maxCount: 1 }]), authMiddleware, updateHomeBanner);
router.delete('/delete-home-banner/:id', authMiddleware, deleteHomeBanner);

router.post('/create-find-resources', upload.fields([{ name: 'image', maxCount: 1 }]), authMiddleware, createFindResources);
router.get('/get-find-resources', getFindResources);
router.get('/get-find-resources/:id', getFindResourcesById);
router.put('/update-find-resources', upload.fields([{ name: 'image', maxCount: 1 }]), authMiddleware, updateFindResources);
router.delete('/delete-find-resources/:id', authMiddleware, deleteFindResources);

router.post('/create-market-glance', authMiddleware, createMarketGlance);
router.get('/get-market-glance', getMarketGlance);
router.get('/get-market-glance/:id', getMarketGlanceById);
router.put('/update-market-glance', authMiddleware, updateMarketGlance);
router.delete('/delete-market-glance/:id', authMiddleware, deleteMarketGlance);

router.post('/create-exclusive-memberships', upload.fields([{ name: 'image', maxCount: 1 }]), authMiddleware, createExclusiveMemberships);
router.get('/get-exclusive-memberships', getExclusiveMemberships);
router.get('/get-exclusive-memberships/:id', getExclusiveMembershipsById);
router.put('/update-exclusive-memberships', upload.fields([{ name: 'image', maxCount: 1 }]), authMiddleware, updateExclusiveMemberships);
router.delete('/delete-exclusive-memberships/:id', authMiddleware, deleteExclusiveMemberships);

router.post('/home-header', authMiddleware, createHomeHeader);
router.get('/home-header', getHomeHeader);
router.put('/home-header', authMiddleware, updateHomeHeader);
router.delete('/home-header/:id', authMiddleware, deleteHomeHeader);

module.exports = router;
