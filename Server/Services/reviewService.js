const Review = require('../Models/review.model');
const Product = require('../Models/product.model');

const addReview = async (reviewData) => {
    const review = new Review(reviewData);
    await review.save();

    // Update product rating average
    const stats = await Review.aggregate([
        { $match: { productId: review.productId } },
        { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(review.productId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            reviewCount: stats[0].count
        });
    }

    return review;
};

const getProductReviews = async (productId) => {
    return await Review.find({ productId }).sort({ createdAt: -1 });
};

module.exports = { addReview, getProductReviews };
