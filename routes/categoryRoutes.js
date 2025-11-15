const express = require('express');
const categoryController = require('../controllers/categoryController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/categories', isAuthenticated, categoryController.getAllCategories);
router.post('/category/create', isAuthenticated, categoryController.createCategory);
router.post('/category/update/:id', isAuthenticated, categoryController.updateCategory);
router.get('/category/delete/:id', isAuthenticated, categoryController.deleteCategory);

module.exports = router;
