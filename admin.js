const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');  // Thêm vào

// === LOGIN ===
router.post('/login', async function (req, res) {
  const { username, password } = req.body;

  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(username, password);  // Generate JWT token
      res.json({ success: true, message: 'Authentication successful', token: token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

// === CHECK TOKEN ===
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

// === CATEGORY: Get all categories ===
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// === CATEGORY: Add a new category ===
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = { name };
    const result = await CategoryDAO.insert(category);
    res.json({ success: true, message: 'Category added successfully', category: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// === CATEGORY: Update an existing category ===
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = { _id, name };
    const result = await CategoryDAO.update(category);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category updated successfully', category: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// === CATEGORY: Delete an existing category ===
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const result = await CategoryDAO.delete(_id);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully', category: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// === PRODUCT: Get all products with pagination ===
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    let products = await ProductDAO.selectAll();

    const sizePage = 4;
    const noPages = Math.ceil(products.length / sizePage);
    let curPage = 1;
    if (req.query.page) curPage = parseInt(req.query.page);

    const offset = (curPage - 1) * sizePage;
    products = products.slice(offset, offset + sizePage);

    const result = { products: products, noPages: noPages, curPage: curPage };
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// === PRODUCT: Add a new product ===
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    const { name, price, category, image } = req.body;
    const now = new Date().getTime();

    const categoryData = await CategoryDAO.selectByID(category);
    if (!categoryData) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const product = {
      name: name,
      price: price,
      image: image,
      cdate: now,
      category: categoryData
    };

    const result = await ProductDAO.insert(product);
    res.json({ success: true, message: 'Product added successfully', product: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// === PRODUCT: Update an existing product ===
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.body.name; 
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime();

    const category = await CategoryDAO.selectByID(cid);
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const product = {
      _id: _id,
      name: name,
      price: price,
      image: image,
      cdate: now,
      category: category
    };

    const result = await ProductDAO.update(product);
    res.json({ success: true, message: 'Product updated successfully', product: result });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});
// DELETE product by id
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

module.exports = router;
