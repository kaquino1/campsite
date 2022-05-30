const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { isValidObjectId } = require('mongoose');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isCampgroundId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash('error', 'Cannot Find That Campground!');
    return res.redirect('/campgrounds');
  }
  next()
}

module.exports.isReviewId = (req, res, next) => {
  const { reviewId } = req.params;

  if (!isValidObjectId(reviewId)) {
    req.flash('error', 'Cannot Find That Review!');
    return res.redirect('/campgrounds');
  }
  next()
}

module.exports.isUserId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash('error', 'Cannot Find That User!');
    return res.redirect('/campgrounds');
  }
  next()
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;

  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot Find That Campground!');
    return res.redirect('/campgrounds');
  }
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash('error', 'Cannot Find That Review!');
    return res.redirect('/campgrounds');
  }
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
