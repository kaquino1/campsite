const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  review.campground = req.params.id;
  campground.reviews.push(review);
  campground.rating = parseInt(campground.rating) + parseInt(req.body.review.rating);
  await review.save();
  await campground.save();
  req.flash('success', 'Successfully Created a New Review!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  const review = await Review.findByIdAndDelete(reviewId);
  campground.rating = parseInt(campground.rating) - parseInt(review.rating);
  await campground.save();
  req.flash('success', 'Successfully Deleted a Review!');
  res.redirect(`/campgrounds/${id}`);
};
