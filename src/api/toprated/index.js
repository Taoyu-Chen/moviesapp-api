import express from 'express';
import {
  getTopRatingMovies,
  getMovieReviews
} from '../tmdb-api';
import movieModel from './movieModel';
const router = express.Router();

// router.get('/', (req, res,next) => {
//   getMovies().then(movies => res.status(200).send(movies));
// });

router.get('/', (req, res, next) => {
  getTopRatingMovies().then(movies => {
    console.info(`${movies.length}`);
    res.status(200).send(movies);
    try {
      movieModel.deleteMany();
      movieModel.collection.insertMany(movies);
      console.info(`${movies.length} movies were successfully stored.`);
    } catch (err) {
      console.error(`failed to insert movies Data: ${err}`);
    }
  }).catch(next);
});

// router.get('/:id', (req, res, next) => {
//   const id = parseInt(req.params.id);
//   getMovie(id).then(movie => res.status(200).send(movie));
// });

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  movieModel.findByMovieDBId(id).then(movie => res.status(200).send(movie)).catch(next);
});

router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieReviews(id)
  .then(reviews => res.status(200).send(reviews))
  .catch((error) => next(error));
});

export default router;