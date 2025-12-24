const Product = require('../Models/product.model');

const getAllProducts = async (req, res) => {
    try {
        const { gender, category, brand, color, size, minPrice, maxPrice, q, sort, page = 1, limit = 12 } = req.query;
        let query = {};

        // Text search logic
        if (q) {
            query.$text = { $search: q };
        }

        // Filtering logic
        if (gender) query.gender = gender;
        if (category) query.category = category;
        if (brand) {
            query.brand = { $in: brand.split(',') };
        }

        // Price filtering
        if (minPrice || maxPrice) {
            query['variants.price'] = {};
            if (minPrice) query['variants.price'].$gte = Number(minPrice);
            if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
        }

        // Variant-based filtering (color, size)
        if (color) query['variants.color'] = { $in: color.split(',') };
        if (size) query['variants.size'] = { $in: size.split(',') };

        let result = Product.find(query);

        // Sorting logic
        if (sort) {
            const sortMapping = {
                'price-low': 'variants.0.price',
                'price-high': '-variants.0.price',
                'newest': '-createdAt',
                'rating': '-rating'
            };
            result = result.sort(sortMapping[sort] || '-createdAt');
        } else if (q) {
            // Sort by relevance score if searching and no explicit sort
            result = result.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
        } else {
            result = result.sort('-createdAt');
        }

        // Pagination logic
        const skip = (page - 1) * limit;
        result = result.skip(skip).limit(Number(limit));

        const products = await result;
        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            products,
            totalProducts,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.status(200).json([]);

        const suggestions = await Product.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .limit(5)
            .select('title brand category');

        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    getSearchSuggestions
};
