import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
//import authenticate from './src/authenticate'; remove
import passport from './src/authenticate';
import swaggerUi from 'swagger-ui-express'; 
import options from './src/config/swagger.json';
import moviesRouter from './src/api/movies';
import genresRouter from './src/api/genres';
import bodyParser from 'body-parser';
import usersRouter from './src/api/users';

import './src/db/db.js';
import {loadUsers, loadMovies} from './src/seedData';

dotenv.config();

const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍, ${err.stack} `);
};

const app = express();

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
const port = process.env.PORT;

//session middleware
app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));

// initialise passport
app.use(passport.initialize());

app.use(express.static('public'));
// Add passport.authenticate(..)  to middleware stack for protected routes​
app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/users', usersRouter);
app.use('/api/genres', genresRouter);

if (process.env.SEED_DB) {
  loadUsers();
  loadMovies();
}
// config swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(options));

app.use(errHandler);


app.listen(port, () => {
  console.info(`Server running at ${port}`);
});