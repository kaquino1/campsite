const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isUserId } = require('../middleware');
const passport = require('passport');

router
  .route('/signup')
  .get(userControllers.renderSignup)
  .post(catchAsync(userControllers.signup));

router
  .route('/login')
  .get(userControllers.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userControllers.login);

router
  .route('/logout')
  .get(userControllers.logout);

router
  .route('/users/:id/campgrounds')
  .get(
    isLoggedIn,
    isUserId,
    catchAsync(userControllers.renderUserCampgrounds));

router
  .route('/users/:id/reviews')
  .get(
    isLoggedIn,
    isUserId,
    catchAsync(userControllers.renderUserReviews));

module.exports = router;