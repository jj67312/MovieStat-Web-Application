const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  budget: {
    type: Number,
  },
  homepage: {
    type: String,
  },
  overview: {
    type: String,
  },
  release_date: {
    type: String,
  },
  revenue: {
    type: Number,
  },
  runtime: {
    type: Number,
  },
  tagline: {
    type: String,
  },
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  posterPath: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

module.exports = mongoose.model('Movie', movieSchema, 'movies');
