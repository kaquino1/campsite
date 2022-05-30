const express = require('express');
const router = express.Router();
const campgroundControllers = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCampgroundId, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(campgroundControllers.showCampgrounds))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    catchAsync(campgroundControllers.createCampground));

router
  .route('/new')
  .get(
    isLoggedIn,
    campgroundControllers.renderNewForm);

router
  .route('/:id')
  .get(
    isCampgroundId,
    catchAsync(campgroundControllers.showCampground))
  .put(
    isLoggedIn,
    isCampgroundId,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgroundControllers.updateCampground)
  )
  .delete(
    isLoggedIn,
    isCampgroundId,
    isAuthor,
    catchAsync(campgroundControllers.deleteCampground));

router
  .route('/:id/edit')
  .get(
    isLoggedIn,
    isCampgroundId,
    isAuthor,
    catchAsync(campgroundControllers.renderEditForm));

module.exports = router;
