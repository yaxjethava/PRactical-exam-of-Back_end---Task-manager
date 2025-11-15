const express = require('express');
const taskController = require('../controllers/taskController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/tasks', isAuthenticated, taskController.getAllTasks);
router.get('/task/form/:id', isAuthenticated, taskController.getTaskForm);
router.post('/task/create', isAuthenticated, upload.single('taskImage'), taskController.createTask);
router.post('/task/update/:id', isAuthenticated, upload.single('taskImage'), taskController.updateTask);
router.get('/task/delete/:id', isAuthenticated, taskController.deleteTask);
router.get('/task/view/:id', isAuthenticated, taskController.getTaskById);

module.exports = router;
