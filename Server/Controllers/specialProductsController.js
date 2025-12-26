const SpecialProduct = require('../Models/specialProducts.model');
const productService = require('../Services/productService');


const createProduct = async (req, res) => {
    // ...
};


const getAllProducts = async (req, res) => {
    try {
        const specialItems = await SpecialProduct.find({}, '_id');
        const ids = specialItems.map(item => item._id);

        const result = await productService.getProducts({
            ...req.query,
            ids
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createProduct,
    getAllProducts
};
