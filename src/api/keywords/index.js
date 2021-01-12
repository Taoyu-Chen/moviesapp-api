import express from 'express';
import {
  getMovieKeywords
} from '../tmdb-api';
import keywordModel from './keywordModel';
const router = express.Router();

router.get('/', (req, res, next) => {
  keywordModel.find().then(keywords => res.status(200).send(keywords)).catch(next);
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieKeywords(id).then(async(keywords) => {
    console.info(`${keywords}`);
    res.status(200).send(keywords);
    try {
      await keywordModel.collection.deleteMany();
      await keywordModel.collection.insertMany(keywords);
      console.info(`${keywords.length} Keywords were successfully stored.`);
    } catch (err) {
      console.error(`failed to insert keywords Data: ${err}`);
    }
  }).catch(next);
});

router.get('/data', (req, res, next) => {
  keywordModel.find().then(keywords => res.status(200).send(keywords)).catch(next);
});

export default router;