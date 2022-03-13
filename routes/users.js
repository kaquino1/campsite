const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const passport = require('passport');

router.route('/signup').get(userControllers.renderSignup).post(catchAsync(userControllers.signup));

router
  .route('/login')
  .get(userControllers.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userControllers.login);

router.get('/logout', userControllers.logout);

router.get('/users/:id/campgrounds', isLoggedIn, userControllers.campgroundIndex);

router.get('/users/:id/reviews', isLoggedIn, userControllers.reviewIndex);

router.get('/users/:id/campgrounds/pages/:page', isLoggedIn, catchAsync(userControllers.renderUserCampgrounds));

router.get('/users/:id/reviews/pages/:page', isLoggedIn, catchAsync(userControllers.renderUserReviews));

module.exports = router;
