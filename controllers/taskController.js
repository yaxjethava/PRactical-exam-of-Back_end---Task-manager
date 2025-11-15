const Task = require('../models/taskModel');
const User = require('../models/userModel');

const getAllTasks = async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin') {
      tasks = await Task.find().populate('category').populate('assignedTo').populate('createdBy');
    } else {
      tasks = await Task.find({
        $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }],
      })
      .populate('category')
      .populate('assignedTo')
      .populate('createdBy');
    }
    
    const users = await User.find();
    res.status(200).render('taskList', { tasks, users });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).render('error', { message: 'Error fetching tasks' });
  }
  console.log(req.user);
};

const getTaskForm = async (req, res) => {
  try {
    const { id } = req.params;
    let task = null;
    const users = await User.find();
    const categories = require('../models/categoryModel');
    const allCategories = await categories.find();

    if (id && id !== 'new') {
      task = await Task.findById(id).populate('category').populate('assignedTo');
      if (!task) {
        return res.status(404).render('error', { message: 'Task not found' });
      }

      if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
        return res.status(403).render('error', { message: 'Not authorized to edit this task' });
      }
    }

    res.status(200).render('taskForm', { task, users, categories: allCategories });
  } catch (error) {
    console.error('Error loading task form:', error);
    res.status(500).render('error', { message: 'Error loading form' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category, assignedTo, tags } = req.body;

    if (!title) {
      return res.status(400).render('error', { message: 'Task title is required' });
    }

    const taskData = {
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      category: category || null,
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id,
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
    };

    if (req.file) {
      taskData.taskImage = req.file.path;
    }

    await Task.create(taskData);
    res.status(201).redirect('/tasks');
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).render('error', { message: 'Error creating task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, category, assignedTo, tags } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).render('error', { message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.render('error', { message: 'Not authorized to update this task, Only admin can do this!! ' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    task.category = category || task.category;
    task.assignedTo = assignedTo || task.assignedTo;
    task.tags = tags ? tags.split(',').map((tag) => tag.trim()) : task.tags;
    task.updatedAt = new Date();

    if (req.file) {
      task.taskImage = req.file.path;
    }

    await task.save();
    res.status(200).redirect('/tasks');
  } catch (error) {
    console.error('Error updating task:', error);
    res.render('error', { message: 'Error updating task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      // return res.json({ message: 'Not authorized to delete this task, Only admin can do this!! ' });
      return res.render('error', { message: 'Not authorized to delete this task, Only admin can do this!! '  });

    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.json({ message: 'Error deleting task' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate('category')
      .populate('assignedTo')
      .populate('createdBy');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.json({ message: 'Not authorized to view this task, only admin can do this !' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

module.exports = {
  getAllTasks,
  getTaskForm,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
};
