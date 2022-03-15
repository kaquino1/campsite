const User = require('../models/user');
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.renderSignup = (req, res) => {
  res.render('users/signup');
};

module.exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to CampSite!');
      res.redirect('/campgrounds/pages/1');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', `Welcome Back ${req.body.username}!`);
  const redirectUrl = req.session.returnTo || '/campgrounds/pages/1';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye!');
  res.redirect('/campgrounds/pages/1');
};

module.exports.campgroundIndex = (req, res) => {
  const { id } = req.params;
  res.redirect(`/users/${id}/campgrounds/pages/1`);
};

module.exports.reviewIndex = (req, res) => {
  const { id } = req.params;
  res.redirect(`/users/${id}/reviews/pages/1`);
};

module.exports.renderUserCampgrounds = async (req, res) => {
  const { id, page } = req.params;
  if (page < 1) {
    req.flash('error', 'Cannot Find That Page!');
    return res.redirect('/campgrounds/pages/1');
  }
  const nPerPage = 12;
  const count = await Campground.count({ author: id });
  const maxPage = count == 0 ? 0 : Math.ceil(count / nPerPage);

  if (page > maxPage && count != 0) {
    req.flash('error', 'Cannot Find That Page!');
    return res.redirect('/campgrounds/pages/1');
  }
  const currPage = req.params.page - 1;
  const campgrounds = await Campground.find({ author: id })
    .skip(nPerPage * currPage)
    .limit(nPerPage);

  if (count == 0) {
    return res.render('users/noSubmissions', { type: 'campgrounds' });
  }
  res.render('users/showCampgrounds', { campgrounds, pages: maxPage, current: Number(page) });
};

module.exports.renderUserReviews = async (req, res) => {
  const { id, page } = req.params;
  if (page < 1) {
    req.flash('error', 'Cannot Find That Page!');
    req.session.save();
    return res.redirect('/campgrounds/pages/1');
  }
  const nPerPage = 12;
  const count = await Review.count({ author: id });
  const maxPage = count == 0 ? 0 : Math.ceil(count / nPerPage);

  if (page > maxPage && count != 0) {
    req.flash('error', 'Cannot Find That Page!');
    req.session.save();
    return res.redirect('/campgrounds/pages/1');
  }
  const currPage = req.params.page - 1;
  const reviews = await Review.find({ author: id })
    .skip(nPerPage * currPage)
    .limit(nPerPage)
    .populate('campground');

  if (count == 0) {
    return res.render('users/noSubmissions', { type: 'reviews' });
  }
  res.render('users/showReviews', { reviews, pages: maxPage, current: Number(page) });
};
