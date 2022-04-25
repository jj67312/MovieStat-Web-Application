const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const posterSchema = new Schema({
  Title: {
    type: String,
  },
  imdbScore: {
    type: Number,
  },
  Poster: {
    type: String,
  },
});

module.exports = mongoose.model('Poster', posterSchema, 'posters');
