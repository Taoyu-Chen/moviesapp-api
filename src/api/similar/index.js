import express from 'express';
import {
  getSimilarMovies,
  getMovieReviews
} from '../tmdb-api';
import movieModel from './movieModel';
const router = express.Router();

router.get('/', (req, res, next) => {
  movieModel.find().then(movies => {
    res.status(200).send(movies);
  }).catch((err) => next(err));
});

router.get('/db/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  getSimilarMovies(id).then(async (movies) => {
    res.status(200).send(movies);
    try {
      await movieModel.deleteMany({});
      await movieModel.collection.insertMany(movies);
      console.info(`${movies.length} movies were successfully stored.`);
    } catch (err) {
      console.error(`failed to insert movies Data: ${err}`);
    }
  }).catch((err) => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  movieModel.findByMovieDBId(id).then(movie => {
    if (movie) {
      return res.status(200).send(movie);
    } else {
      return res.status(404).send({message: `Failed to find movie with id: ${id}.`, status: 404});
    }
  }).catch((err) => next(err));
});


router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieReviews(id)
  .then(reviews => res.status(200).send(reviews))
  .catch((err) => next(err));
});

// Delete a movie
router.delete('/:id', (req, res, next) => {
  movieModel.findOneAndDelete({
            id: req.params.id
        })
        .then((result, id) => {
            if (result) {
              return res.status(200).send({message: `Successfully deleted movie with id: ${id}.`, status: 200});
            } else {
                return res.status(404).send({message: `Successfully deleted movie with id: ${id}.`, status: 404});
            }
        }).catch((err) => next(err));
});



export default router;