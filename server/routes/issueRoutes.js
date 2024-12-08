const express = require('express');
const { addCategory, getCategories, deleteCategory } = require('../controllers/issueController');

const router = express.Router();

// Route to add a new category
router.post('/addCategory', addCategory);

// Route to get all categories
router.get('/categories', getCategories);

// Route to delete a category
router.delete('/deleteCategory', deleteCategory);

module.exports = router;
