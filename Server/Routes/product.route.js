const express = require('express');
const { getAllProducts, getProductById, createProduct, getSearchSuggestions } = require('../Controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/:id', getProductById);
router.post('/', createProduct);

module.exports = router;
