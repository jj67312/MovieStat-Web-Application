const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieTagsSchema = new Schema({
  title: {
    type: String,
  },
  tags: {
    type: String,
  },
  movie_id: {
    type: Number,
  },
});

module.exports = mongoose.model('MovieTag', movieTagsSchema, 'movieTags');
