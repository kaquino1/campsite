const express = require('express');
const router = express.Router();
const campgroundControllers = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(campgroundControllers.showCampgrounds))
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundControllers.createCampground));

router.get('/new', isLoggedIn, campgroundControllers.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(campgroundControllers.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgroundControllers.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundControllers.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundControllers.renderEditForm));

module.exports = router;
