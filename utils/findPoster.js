const axios = require('axios');
// const imgModel = require('../models/image');

// function for finding movie poster using TMDB api
const findPoster = async function (movieID) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieID}?api_key=ff7878f10d436a1136f477727bf52b1d&language=en-US`
    );
    // console.log(
    //   '-------------------------------------------------------------------------'
    // );

    // console.log('The movie id = ', id);
    const posterPath = res.data.poster_path;
    // console.log('The poster path is = ', posterPath);
    // console.log(
    //   '-------------------------------------------------------------------------'
    // );
    return posterPath;
  } catch (e) {
    console.log('Error! Poster API failed!');
  }
};

module.exports = findPoster;
