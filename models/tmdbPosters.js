const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tmdbPosterSchema = new Schema({
  id: {
    type: Number,
  },
  title: {
    type: String,
  },
  poster_path: {
    type: String,
  },
});

module.exports = mongoose.model('tmdbPoster', tmdbPosterSchema, 'tmdbPosters');
