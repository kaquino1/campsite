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
      res.redirect('/campgrounds');
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
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye!');
  res.redirect('/campgrounds');
};

module.exports.renderUserCampgrounds = async (req, res) => {
  const { id } = req.params;
  const page = req.query.page || 1;
  if (page < 1) {
    req.flash('error', 'Cannot Find That Page!');
    return res.redirect('/campgrounds');
  }
  const limit = 12;
  const count = await Campground.count({ author: id });
  const maxPage = count == 0 ? 0 : Math.ceil(count / limit);

  if (page > maxPage && count != 0) {
    req.flash('error', 'Cannot Find That Page!');
    return res.redirect('/campgrounds');
  }
  const currPage = req.query.page - 1;
  const campgrounds = await Campground.find({ author: id })
    .skip(limit * currPage)
    .limit(limit);

  if (count == 0) {
    return res.render('users/noSubmissions', { type: 'campgrounds' });
  }
  res.render('users/showCampgrounds', { campgrounds, pages: maxPage, current: Number(page) });
};

module.exports.renderUserReviews = async (req, res) => {
  const { id } = req.params;
  const page = req.query.page || 1;
  if (page < 1) {
    req.flash('error', 'Cannot Find That Page!');
    req.session.save();
    return res.redirect('/campgrounds');
  }
  const limit = 12;
  const count = await Review.count({ author: id });
  const maxPage = count == 0 ? 0 : Math.ceil(count / limit);

  if (page > maxPage && count != 0) {
    req.flash('error', 'Cannot Find That Page!');
    req.session.save();
    return res.redirect('/campgrounds');
  }
  const currPage = req.query.page - 1;
  const reviews = await Review.find({ author: id })
    .skip(limit * currPage)
    .limit(limit)
    .populate('campground');

  if (count == 0) {
    return res.render('users/noSubmissions', { type: 'reviews' });
  }
  res.render('users/showReviews', { reviews, pages: maxPage, current: Number(page) });
};
