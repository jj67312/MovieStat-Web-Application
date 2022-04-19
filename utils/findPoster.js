const axios = require('axios');
// const imgModel = require('../models/image');

// function for finding movie poster using TMDB api
const findPoster = async function (movieID) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieID}?api_key=ff7878f10d436a1136f477727bf52b1d&language=en-US`
    );
    const posterPath = res.data.poster_path;
    return posterPath;
  } catch (e) {
    console.log('Error! Poster API failed!');
  }
};

module.exports = findPoster;
