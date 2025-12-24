const Product = require('../Models/womenProducts.model')

const createWomensProduct = async (req, res) => {
    try {
        const { title, img, price, category } = req.body;

        const newProduct = new Product({
            title,
            img,
            price,
            category,
        });

        const savedProduct = await newProduct.save()
        res.status(201).json({
            message: 'womens Product created successfully',
            product: savedProduct,
        });
    } catch (error) {
        console.error('Error creating product:', error)
        res.status(400).json({ message: error.message })
    }
};

const getWomensProduct = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error)
        res.status(500).json({ message: error.message })
    }
};

module.exports = {
     createWomensProduct,
     getWomensProduct,
};
