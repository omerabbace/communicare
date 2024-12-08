const { db } = require('../firebase');

// Controller to add a new issue category
exports.addCategory = async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const newCategoryRef = db.ref('issueCategories').push();
    await newCategoryRef.set({
      label: categoryName,
      value: categoryName.toLowerCase().replace(/\s+/g, '-')
    });
    
    res.status(200).json({ success: true, message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
};

// Controller to fetch all issue categories
exports.getCategories = async (req, res) => {
  try {
    const categoriesRef = db.ref('issueCategories');
    categoriesRef.once('value', (snapshot) => {
      const categories = snapshot.val();
      res.status(200).json({ categories });
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Controller to delete an issue category
exports.deleteCategory = async (req, res) => {
  const { categoryLabel } = req.body;

  if (!categoryLabel) {
    return res.status(400).json({ error: 'Category label is required' });
  }

  try {
    const categoriesRef = db.ref('issueCategories');
    categoriesRef.once('value', (snapshot) => {
      const categories = snapshot.val();
      const categoryKey = Object.keys(categories || {}).find(
        (key) => categories[key].label === categoryLabel
      );

      if (!categoryKey) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Remove the category
      db.ref(`issueCategories/${categoryKey}`).remove()
        .then(() => {
          res.status(200).json({ success: true, message: 'Category deleted successfully' });
        })
        .catch((error) => {
          console.error('Error deleting category:', error);
          res.status(500).json({ error: 'Failed to delete category' });
        });
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};