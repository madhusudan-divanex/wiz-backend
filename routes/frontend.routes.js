const authMiddleware = require('../middlewares/auth.middleware');
const { contactCMS, getContactCMS, getTips, createTip, updateTip, deleteTip, updateFaq, getAllFaqs, createFaq, deleteFaq, getCategory, createCategory, deleteCategory, updateCategory, createBlog, getBlogs, updateBlog, deleteBlog, getBlogData } = require('../controllers/frontend.controller');
const express =  require('express');
const getUploader = require('../config/multerConfig');
const router = express.Router();
const upload = getUploader('general')
router.post('/contact',authMiddleware,contactCMS)
router.get('/contact',getContactCMS)

router.post('/tip',upload.fields([
    { name: 'image', maxCount: 1 }]),authMiddleware,createTip);
router.get('/tips',getTips);  
router.put('/tip',upload.fields([
    { name: 'image', maxCount: 1 }]),authMiddleware,updateTip);
router.delete('/tip/:id',authMiddleware,deleteTip);
router.post("/faq",authMiddleware, createFaq);
router.get("/faq", getAllFaqs);
router.put("/faq",authMiddleware, updateFaq);
router.delete("/faq/:id",authMiddleware, deleteFaq);

router.post('/blog-category',authMiddleware,createCategory);
router.put('/blog-category',authMiddleware,updateCategory);
router.get('/blog-category', getCategory);
router.delete('/blog-category/:id',authMiddleware, deleteCategory);

router.post('/blog',upload.fields([
    { name: 'image', maxCount: 1 }]),authMiddleware,createBlog);
router.get('/blogs',getBlogs);  
router.get('/blog-data/:id',getBlogData);  

router.put('/blog',upload.fields([
    { name: 'image', maxCount: 1 }]),authMiddleware,updateBlog);
router.delete('/blog/:id',authMiddleware,deleteBlog);

module.exports = router;