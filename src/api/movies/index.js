import express from 'express';
import {
  //getMovies, getMovie,
  getMovieReviews
} from '../tmdb-api';
import movieModel from './movieModel';
const router = express.Router();

// router.get('/', (req, res,next) => {
//   getMovies().then(movies => res.status(200).send(movies));
// });

router.get('/', (req, res, next) => {
  movieModel.find().then(movies => res.status(200).send(movies)).catch(next);
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

// Delete a movie
router.delete('/:id', (req, res) => {
  movieModel.findOneAndDelete({
            id: req.params.id
        })
        .then(result => {
            if (result) {
                return res.status(200).json({
                    success: true,
                    message: "Movie deleted"
                });
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Movie not exist'
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        });
});


export default router;