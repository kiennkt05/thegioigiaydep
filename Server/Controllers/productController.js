const asyncHandler = require('express-async-handler');
const productService = require('../Services/productService');

const getAllProducts = asyncHandler(async (req, res) => {
    const result = await productService.getProducts(req.query);
    res.status(200).json(result);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
});

const createProduct = asyncHandler(async (req, res) => {
    // Basic implementation, usually handled via specialized import scripts in this project
    const Product = require('../Models/product.model');
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
});

const getSearchSuggestions = asyncHandler(async (req, res) => {
    const suggestions = await productService.getSearchSuggestions(req.query.q);
    res.status(200).json(suggestions);
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    getSearchSuggestions
};
