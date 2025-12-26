const asyncHandler = require('express-async-handler');
const reviewService = require('../Services/reviewService');

exports.addReview = asyncHandler(async (req, res) => {
    const review = await reviewService.addReview(req.body);
    res.status(201).json(review);
});

exports.getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getProductReviews(req.params.productId);
    res.status(200).json(reviews);
});
