const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });
const { cloudinary } = require('../cloudinary');
const { isValidObjectId } = require('mongoose');

module.exports.showCampgrounds = async (req, res) => {
  const page = req.query.page || 1;
  if (page < 1) {
    req.flash('error', 'Cannot Find That Page!');
    return res.redirect('/campgrounds');
  }
  const limit = 12
  const allCampgrounds = await Campground.find({});
  const count = allCampgrounds.length;
  const maxPage = count == 0 ? 0 : Math.ceil(count / limit);

  if (page > maxPage && count != 0) {
    req.flash('error', 'Cannot Find That Page!');
    return res.redirect('/campgrounds');
  }

  const currPage = req.query.page - 1;
  const campgrounds = await Campground.find({})
    .skip(limit * currPage)
    .limit(limit);
  res.render('campgrounds/index', { allCampgrounds, campgrounds, current: Number(page), pages: maxPage });
}

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({ query: req.body.campground.location, limit: 1 }).send();

  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  campground.rating = 0;
  await campground.save();
  req.flash('success', 'Successfully Created a New Campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    req.flash('error', 'Cannot Find That Campground!');
    return res.redirect('/campgrounds');
  }
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Cannot Find That Campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot Find That Campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully Deleted a Campground');
  res.redirect('/campgrounds');
};
