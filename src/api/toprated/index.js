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
  getTopRatingMovies().then(async (movies) => {
    console.info(`${movies.length}`);
    res.status(200).send(movies);
    try {
      await movieModel.collection.deleteMany();
      await movieModel.collection.insertMany(movies);
      console.info(`${movies.length} movies were successfully stored.`);
    } catch (err) {
      console.error(`failed to insert movies Data: ${err}`);
    }
  }).catch(next);
});

router.get('/data', (req, res, next) => {
  movieModel.find().then(movies => res.status(200).send(movies)).catch(next);
});

router.get('movie/:id', (req, res, next) => {
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