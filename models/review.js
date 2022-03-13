const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  campground: {
    type: Schema.Types.ObjectId,
    ref: 'Campground'
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
