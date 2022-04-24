const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Movie = require('../models/movies');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash(
          'success',
          `Welcome to MovieStat! ${registeredUser.username}`
        );
        res.redirect('/movies');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
    }
  })
);

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!`);
    // This is from JS51 last video, does not work for our case.
    // const redirectUrl = req.session.returnTo || '/movies';
    // console.log('RedirectUrl = ', redirectUrl);
    res.redirect('/movies');
  }
);

// logout route:
router.get('/logout', (req, res) => {
  const currUser = req.user;
  req.logout();
  req.flash('success', `See you soon ${currUser.username}!`);
  res.redirect('/login');
});

// user feedback 2.0
router.post('/liked/:movieId/:id', async (req, res) => {
  const { movieId, id } = req.params;
  const user = await User.findById(id);
  const movie = await Movie.findById(movieId);
  // Now add that movie title to the user's likedMovies array
  user.likedMovies.push(movie.title);
  await user.save();
  res.redirect(`/movies/${movieId}`);
});

// user feedback to remove liked movies:
router.post('/disliked/:movieId/:id', async (req, res) => {
  const { movieId, id } = req.params;
  const user = await User.findById(id);
  const movie = await Movie.findById(movieId);

  // now remove the movie object from the likedMovies array of user
  const index = user.likedMovies.indexOf(movie.title);
  if (index > -1) {
    user.likedMovies.splice(index, 1);
  }
  await user.save();
  res.redirect(`/movies/${movieId}`);
});

// show all movies liked by a user
router.get('/likedMovies/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const movies = await Movie.find({});

  // find all the liked movies by the current user:
  let allLikedMovies = [];
  for (let likedMovie of user.likedMovies) {
    let movie = await Movie.findOne({ title: likedMovie });
    allLikedMovies.push(movie);
  }

  // find all watched movies by the current user:
  let allWatchedMovies = [];
  for (let watchedMovie of user.watchedMovies) {
    let movie = await Movie.findOne({ title: watchedMovie });
    allWatchedMovies.push(movie);
  }

  allWatchedMovies = allWatchedMovies.reverse();

  res.render('users/likedMovies', {
    user,
    movies,
    allLikedMovies,
    allWatchedMovies,
  });
});

// user feedback to remove watched movies:
router.post('/removeWatchedMovies/:movieId/:id', async (req, res) => {
  const { movieId, id } = req.params;
  const user = await User.findById(id);
  const currentMovie = await Movie.findById(movieId);

  // now remove the currentMovie object from the watchedMovies array of user
  const index = user.watchedMovies.indexOf(currentMovie.title);
  if (index > -1) {
    user.watchedMovies.splice(index, 1);
  }
  await user.save();
  res.redirect(`/likedMovies/${id}`);
});

module.exports = router;
