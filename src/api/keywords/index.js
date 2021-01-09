import express from 'express';
import {
  getMovieKeywords
} from '../tmdb-api';
import keywordModel from './keywordModel';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).send("You should enter movie id to get movie keywords").catch(next);
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieKeywords(id).then(keywords => {
    console.info(`${keywords}`);
    res.status(200).send(keywords);
    try {
      keywordModel.deleteMany();
      keywordModel.collection.insertMany(keywords);
      console.info(`${keywords.length} Keywords were successfully stored.`);
    } catch (err) {
      console.error(`failed to insert keywords Data: ${err}`);
    }
  }).catch(next);
});

export default router;