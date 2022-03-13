const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    rating: Number
  },
  opts
);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
  return `<h6 class='mb-1 mt-2 text-center'><a class='text-decoration-none text-dark' href='/campgrounds/${this._id}'>${this.title}</a></h6><p class='mb-0 text-center'>${this.location}</p>`;
});

CampgroundSchema.post('findOneAndDelete', async doc => {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews }
    });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
