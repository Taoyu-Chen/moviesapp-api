import express from 'express';
import {
  getMovieKeywords
} from '../tmdb-api';
import keywordModel from './keywordModel';
const router = express.Router();

router.get('/', (req, res, next) => {
  keywordModel.find().then(keywords => res.status(200).send(keywords))
    .catch((err) => next(err));
});

router.get('db/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieKeywords(id).then(async(keywords) => {
    res.status(200).send(keywords);
    try {
      await keywordModel.deleteMany({});
      await keywordModel.collection.insertMany(keywords);
      console.info(`${keywords.length} Keywords were successfully stored.`);
    } catch (err) {
      console.error(`failed to insert keywords Data: ${err}`);
    }
  }).catch((err) => next(err));
});

export default router;