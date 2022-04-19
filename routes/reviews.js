const express = require('express');
const router = express.Router({ mergeParams: true });

const Movie = require('../models/movies');
const Review = require('../models/reviews');

const validateReview = require('../utils/validateReview');
const { isLoggedIn, isReviewAuthor } = require('../middleware');

// Adding new review
router.post('/', isLoggedIn, validateReview, async (req, res) => {
  // console.log('req.user: ', req.user);
  const { id } = req.params;
  const movie = await Movie.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  movie.reviews.push(review);
  await review.save();
  await movie.save();
  req.flash('success', 'Review added successfully!');
  res.redirect(`/movies/${movie._id}`);
});

//Deleting a review:
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async (req, res) => {
  const { id, reviewId } = req.params;
  const movie = await Movie.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  const review = await Review.findByIdAndDelete(reviewId);
  res.redirect(`/movies/${movie._id}`);
});

module.exports = router;
