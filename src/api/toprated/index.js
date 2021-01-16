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
  movieModel.find().then(movies => res.status(200).send(movies))
    .catch((err) => next(err));
});

//Add new Movie
router.post('/', async (req, res) => {
  let newMovie = req.body;
  if (newMovie && newMovie.original_title) {
    await movieModel.collection.insertOne(newMovie);
    res.status(201).send(newMovie);
  } else {
    res.status(405).send({
      message: "Invalid Movie Data",
      status: 405
    });
  }
});

router.get('/db', (req, res, next) => {
  getTopRatingMovies().then(async (movies) => {
    console.info(`${movies.length}`);
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

// Update a movie
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updateTitle = req.body;
  console.log(req.body);
  const updateMovieResult = await movieModel.findOneAndUpdate(
    { id: id }, updateTitle, { new: true }
  );
  if (updateMovieResult) {
    res.status(200).send(updateMovieResult);
  } else {
    res.status(404).send({
      message: 'Unable to find Movie',
      status: 404
    });
  }
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
        .then((result) => {
            if (result) {
              return res.status(200).send({message: `Successfully deleted movie with id: ${req.params.id}.`, status: 200});
            } else {
              return res.status(404).send({message: `The deleted movie does not exist, the request id: ${req.params.id}.`, status: 404});
            }
        }).catch((err) => next(err));
});
export default router;