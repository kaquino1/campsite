const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isCampgroundId, isReviewId, isReviewAuthor } = require('../middleware');
const reviewControllers = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');

router
  .route('/')
  .post(
    isLoggedIn,
    validateReview,
    catchAsync(reviewControllers.createReview));

router
  .route('/:reviewId')
  .delete(
    isLoggedIn,
    isCampgroundId,
    isReviewId,
    isReviewAuthor,
    catchAsync(reviewControllers.deleteReview));

module.exports = router;
