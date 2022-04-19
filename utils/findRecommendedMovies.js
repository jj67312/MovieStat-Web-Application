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
module.exports.getPersonalizedRecommedations = async function(allLikedMovies) {
  // allLikedMovies ---> array
  
}

