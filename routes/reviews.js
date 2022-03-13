const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviewControllers = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewControllers.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewControllers.deleteReview));

module.exports = router;
