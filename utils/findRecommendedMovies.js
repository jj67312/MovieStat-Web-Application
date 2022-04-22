const axios = require('axios');

// const recommendedMovies = [];

module.exports.getRecommendedMovies = async function (movieName) {
  try {
    const res = await axios.get(`http://127.0.0.1:5000/${movieName}`);
    // const Newres = await axios.post(`http://127.0.0.1:5000`);
    // // idhar object bhej

    // http://127.0.0.1:5000
    // object:
    return res;
  } catch (e) {
    console.log('Python API failed!');
  }
};

// getting personalized recommedations
module.exports.getPersonalizedRecommedations = async function (movies) {
  // movies ---> array
  try {
    const res = await axios
      .post(`http://127.0.0.1:5000/recommend`, { movies })
      .then((response) => {
        // console.log('Does axios post give the stuff?');
        // console.log(typeof response.data);
        return response.data;
      });
    // console.log('In axios outside of then');
    // console.log(res);
    return res;
  } catch (e) {
    console.log('Python 2nd API failed.');
  }
};
