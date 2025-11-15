const Category = require('../models/categoryModel');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('createdBy', 'username');
    res.status(200).render('categoryList', { categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).render('error', { message: 'Error fetching categories' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).render('error', { message: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).render('error', { message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description: description || '',
      color: color || '#3498db',
      createdBy: req.user.id,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).render('error', { message: 'Error creating category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.user.role !== 'admin' && category.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this category' });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.color = color || category.color;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.user.role !== 'admin' && category.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this category' });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
