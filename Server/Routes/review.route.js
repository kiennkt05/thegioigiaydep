const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/reviewController');
// const { protect } = require('../Middlewares/authMiddleware'); // Future check

router.post('/', reviewController.addReview);
router.get('/:productId', reviewController.getProductReviews);

module.exports = router;
