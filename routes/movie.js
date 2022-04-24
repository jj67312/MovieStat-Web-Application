const express = require('express');
const Image = require('../models/image');
const Movie = require('../models/movies');
const User = require('../models/user');
const router = express.Router();
const querystring = require('querystring');
const url = require('url');

const findPoster = require('../utils/findPoster');
const {
  getRecommendedMovies,
  getPersonalizedRecommedations,
} = require('../utils/findRecommendedMovies');
const { isLoggedIn } = require('../middleware');

const getMovieObjects = async function (top5) {
  let top5Objects = [];
  for (let topMovie of top5) {
    const movieObj = await Movie.find({ title: topMovie });
    top5Objects.push(movieObj[0]);
  }
  return top5Objects;
};

const getPersonalizedMovieObjects = async function (topMovies) {
  // topMovies is an array of movie titles
  let topRecommendationsArray = [];
  for (let movie of topMovies) {
    const movieObj = await Movie.findOne({ title: movie });
    topRecommendationsArray.push(movieObj);
  }
  return topRecommendationsArray;
};

const getMoviePosters = async function (top5) {
  const top5Posters = [];
  // console.log(top5);
  for (let topMovie of top5) {
    const movieObj = await Movie.findOne({ title: topMovie });
    // console.log(`The movie is ${movieObj.title}`);
    const posterPath = await findPoster(movieObj.id);
    top5Posters.push(posterPath);
  }
  return top5Posters;
};

// function to remove duplicates from an array
function arrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
}

// ROUTES:

// Home page:
// here personalized recommendations will be shown
router.get('/', isLoggedIn, async (req, res) => {
  const allMovies = await Movie.find({});
  const userName = req.user.username;
  const user = await User.findOne({ username: userName });

  // we have to pass the array likedMovies of current user to the api:
  // first convert that array to json object:

  // Here allLikedMovies is an json object

  let allLikedMovies = [];
  for (let likedMovie of user.likedMovies) {
    const likedMovieObj = JSON.stringify();
    allLikedMovies.push(likedMovie);
  }

  let allWatchedMovies = [];
  console.log('ALL WATCHED MOVIES:');
  for (let watchedMovie of user.watchedMovies) {
    // console.log(watchedMovie);
    // console.log(typeof watchedMovie);
    allWatchedMovies.push(watchedMovie);
  }

  console.log('LIKED MOVIES:');
  console.log(allLikedMovies);

  allWatchedMovies = arrayUnique(allWatchedMovies);
  console.log('WATCHED MOVIES:');
  console.log(allWatchedMovies);

  // Now merge the arrays allLikedMovies and allWatchedMovies
  let movies = arrayUnique(allLikedMovies.concat(allWatchedMovies));
  console.log('MOVIES ARRAY:');
  console.log(movies);

  // CALL NEW METHOD:
  // All the top movie recommendations are stored in this variable
  // Its an array of movie titles
  let topRecommendations = [];
  const allPersonalizedMovies = await getPersonalizedRecommedations(
    movies
  ).then((response) => {
    // response is an array of movie titles
    topRecommendations = response;
  });
  const image = await Image.findById('6249598dd7ba0919b12480c4');

  const topRecommendationsObjects = await getPersonalizedMovieObjects(
    topRecommendations
  );
  const topRecommendationsPosters = await getMoviePosters(topRecommendations);

  if (user.likedMovies.length !== 0 || user.watchedMovies.length !== 0) {
    console.log('Has some data available');
    res.render('movies/index', {
      allMovies,
      image,
      topRecommendationsObjects,
      topRecommendationsPosters,
    });
  } else {
    console.log('No data');
    res.render('users/newUser', { user, allMovies });
  }
});

router.get('/search', async (req, res) => {
  const parsed_Url = url.parse(req.url);
  const { searchMovie } = querystring.parse(parsed_Url.query);
  const movie = await Movie.findOne({ title: searchMovie });
  const movieID = movie._id;
  res.redirect(`/movies/${movieID}`);
});

router.get('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const movies = await Movie.find({});
  const movie = await Movie.findById(id).populate({
    path: 'reviews',
    populate: { path: 'author' },
  });
  const posterPath = await findPoster(movie.id);
  const image = await Image.findById('6249598dd7ba0919b12480c4');

  // TRYING IF USERS SEARCH QUERY CAN BE TRACKED AS WELL
  const userName = req.user.username;
  const user = await User.findOne({ username: userName });
  user.watchedMovies.push(movie.title);
  await user.save();

  let top5 = [];
  const recommendedMovies = await getRecommendedMovies(movie.title).then(
    (res) => {
      const jsonParsed = JSON.parse(res.data);
      const movie1 = jsonParsed.movie_1;
      const movie2 = jsonParsed.movie_2;
      const movie3 = jsonParsed.movie_3;
      const movie4 = jsonParsed.movie_4;
      const movie5 = jsonParsed.movie_5;

      top5.push(movie1);
      top5.push(movie2);
      top5.push(movie3);
      top5.push(movie4);
      top5.push(movie5);
    }
  );

  const top5Objects = await getMovieObjects(top5);
  const top5Posters = await getMoviePosters(top5);

  // Find if the current movie is a liked Movie
  const currUser = req.user;
  const isLikedMovie = currUser.likedMovies.includes(movie.title);

  res.render('movies/show.ejs', {
    movie,
    posterPath,
    image,
    movies,
    top5Objects,
    top5Posters,
    isLikedMovie,
  });
});

module.exports = router;
