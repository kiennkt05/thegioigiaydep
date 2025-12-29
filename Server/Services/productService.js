const Product = require('../Models/product.model');

const getProducts = async (filters) => {
    const { gender, category, brand, color, size, minPrice, maxPrice, q, sort, page = 1, limit = 12 } = filters;
    let query = {};

    if (q) {
        query.$text = { $search: q };
    }

    if (gender) query.gender = gender;
    if (category) query.category = category;
    if (brand) {
        query.brand = { $in: brand.split(',') };
    }
    if (filters.ids) {
        query._id = { $in: filters.ids };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        query.variants = {
            $elemMatch: {
                price: {
                    ...(minPrice !== undefined && { $gte: Number(minPrice) }),
                    ...(maxPrice !== undefined && { $lte: Number(maxPrice) })
                }
            }
        };
    }

    // Variant-based filtering (color, size)
    if (color) query['variants.color'] = { $in: color.split(',') };
    if (size) query['variants.size'] = { $in: size.split(',') };

    // Advanced Filters
    if (filters.style_tags) query.style_tags = { $in: filters.style_tags.split(',') };
    if (filters.rating) query.rating = { $gte: Number(filters.rating) };
    if (filters.fit) query.fit_recommendation = filters.fit;

    let result = Product.find(query);

    if (sort) {
        const sortMapping = {
            'price-low': 'variants.0.price',
            'price-high': '-variants.0.price',
            'newest': '-createdAt',
            'rating': '-rating'
        };
        result = result.sort(sortMapping[sort] || '-createdAt');
    } else if (q) {
        result = result.select({ score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
    } else {
        result = result.sort('-createdAt');
    }

    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(Number(limit));

    const products = await result;
    const totalProducts = await Product.countDocuments(query);

    return {
        products,
        totalProducts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / limit)
    };
};

const getProductById = async (id) => {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
};

const getSearchSuggestions = async (q) => {
    if (!q || q.length < 2) return [];

    return await Product.find(
        { $text: { $search: q } },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .limit(5)
        .select('title brand category');
};

module.exports = { getProducts, getProductById, getSearchSuggestions };
