const express = require('express');
const Image = require('../models/image');
const Movie = require('../models/movies');
const User = require('../models/user');
const router = express.Router();
const querystring = require('querystring');
const url = require('url');

const findPoster = require('../utils/findPoster');
const { getRecommendedMovies, getPersonalizedRecommedations } = require('../utils/findRecommendedMovies');
const { isLoggedIn } = require('../middleware');

const getMovieObjects = async function (top5) {
  let top5Objects = [];
  for (let topMovie of top5) {
    const movieObj = await Movie.find({ title: topMovie });
    top5Objects.push(movieObj[0]);
  }
  return top5Objects;
};

const getMoviePosters = async function (top5) {
  const top5Posters = [];
  for (let topMovie of top5) {
    const movieObj = await Movie.find({ title: topMovie });
    const posterPath = await findPoster(movieObj[0].id);
    top5Posters.push(posterPath);
  }
  return top5Posters;
};

// ROUTES:

// Home page:
// here personalized recommendations will be shown
router.get('/', isLoggedIn, async (req, res) => {
  const allMovies = await Movie.find({});
  const userName = req.user.username;
  const user = await User.findOne({ username: userName });

  // we have to pass the array likedMovies of current user to the api:
  // first convert that array to json object:

  // --------------------------------------------------

  // Here allLikedMovies is an json object
  let movies = [];
  for (let likedMovie of user.likedMovies) {
    const likedMovieObj = JSON.stringify()
    movies.push(likedMovie);
  }

  // CALL NEW METHOD:
  getPersonalizedRecommedations(movies);

  // const allLikedMoviesObj = JSON.stringify(movies);
  res.send({movies});

  // --------------------------------------------------

  // 19/04/2022 10:09 PM
  /*
      user --> likedMovies
      likedMovies --> json format:
       {
         'movies' : [
            'Avatar',
            'Spider-Man'
        ]
      }
  */

  // res.render('movies/index', { allMovies });
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
  console.log('This is ', currUser.username);
  const isLikedMovie = currUser.likedMovies.includes(movie.title);
  if (isLikedMovie) {
    console.log('Yes this movie is liked by ', currUser.username);
  } else {
    console.log('Did not give feedback ', currUser.username);
  }

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
