const Movie = require('.../models/movies');

module.exports.getMovieObjects = async function (top5) {
  let top5Objects = [];
  for (let topMovie of top5) {
    const movieObj = await Movie.find({ title: topMovie });
    top5Objects.push(movieObj[0]);
  }
  for (let i of top5Objects) {
    // console.log(i.title);
  }
  return top5Objects;
};
