const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const MovieTag = require('./models/movieTags');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

// User Model
const User = require('./models/user');
const Movie = require('./models/movies');

const findPoster = require('./utils/findPoster');

// Passport setting
const passport = require('passport');
const LocalStratergy = require('passport-local');

// Including routes
const moviesRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');

const mongoose = require('mongoose');
main()
  .then(() => {
    console.log('Connection to database successful.');
  })
  .catch((err) => {
    console.log('Connection to database failed.');
    console.log(err.response);
  });

async function main() {
  await mongoose.connect('mongodb://localhost:27017/miniProject');
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// for getting the contents of a form from req.body
app.use(express.urlencoded({ extended: true }));

// for making use of DELETE and PUT requests using HTML form
app.use(methodOverride('_method'));

// for sessions:
const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// setting up flash:
app.use(flash());

// setting up authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// routes:

app.get('/getLikedMovies', (req, res) => {
  res.render('getNameTags');
});

app.post('/getLikedMovies', async (req, res) => {
  // Here we will want to have an array/object of all the tags
  const { movieName } = req.body;
  console.log(movieName);
  const movieTags = await MovieTag.find({ title: movieName });
  res.render('movietags', { movieTags });
});

app.use('/', userRoutes);
app.use('/movies', moviesRoutes);
app.use('/movies/:id/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  const { message = 'Something went wrong', statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Something went wrong!';
  }
  res.status(statusCode).render('error', { err });
});

app.listen(3000, (req, res) => {
  console.log('Listening to port 3000.');
});
