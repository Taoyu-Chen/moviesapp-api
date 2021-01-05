import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import movieModel from '../movies/movieModel';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', (req, res, next) => {
    User.find().then(users =>  res.status(200).json(users)).catch(next);
});

// Update a user
router.put('/:id',  (req, res, next) => {
    if (req.body._id) delete req.body._id;
    User.update({
      _id: req.params.id,
    }, req.body, {
      upsert: false,
    })
    .then(user => res.json(200, user)).catch(next);
});

// router.post('/:userName/favourites', (req, res, next) => {
//   const newFavourite = req.body;
//   const query = {username: req.params.userName};
//   if (newFavourite && newFavourite.id) {
//     User.find(query).then(
//       user => {
//         (user.favourites)?user.favourites.push(newFavourite):user.favourites =[newFavourite];
//         User.findOneAndUpdate(query, {favourites:user.favourites}, {
//           new: true
//         }).then(user => res.status(201).send(user));
//       }
//     ).catch(next);
//   } else {
//     res.status(401).send("Unable to find user");
//   }
// });

//Add a favourite. No Error Handling Yet. Can add duplicates too!
router.post('/:userName/favourites', async (req, res, next) => {
  const newFavourite = req.body.id;
  const userName = req.params.userName;
  try {
    const movie = await movieModel.findByMovieDBId(newFavourite);
    const user = await User.findByUserName(userName);
    if(user.favourites.indexOf(movie._id) == -1) {
      await user.favourites.push(movie._id);
      await user.save();
    }
    res.status(201).json(user);
  } catch (err){
    return next(err);
  }
});

// router.get('/:userName/favourites', (req, res, next) => {
//   const user = req.params.userName;
//   User.find( {username: user}).then(
//       user => res.status(201).send(user.favourites)
//   ).catch(next);
// });

router.get('/:userName/favourites', (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('favourites').then(
    user => res.status(201).json(user.favourites)
  ).catch(next);
});
// // authenticate a user
// router.post('/', (req, res, next) => {
//   if (!req.body.username || !req.body.password) {
//       res.status(401).send('authentication failed');
//   } else {
//       User.findByUserName(req.body.username).then(user => {
//           if (user.comparePassword(req.body.password)) {
//               req.session.user = req.body.username;
//               req.session.authenticated = true;
//               res.status(200).json({
//                   success: true,
//                   token: "temporary-token"
//                 });
//           } else {
//               res.status(401).json('authentication failed');
//           }
//       }).catch(next);
//   }
// });

// Register OR authenticate a user
router.post('/', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json({
      success: false,
      msg: 'Please pass username and password.',
    });
  }
  if (req.query.action === 'register') {
    await User.create(req.body).catch(next);
    res.status(201).json({
      code: 201,
      msg: 'Successful created new user.',
    });
  } else {
    const user = await User.findByUserName(req.body.username).catch(next);
      if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.username, process.env.SECRET);
          // return the information including token as JSON
          res.status(200).json({
            success: true,
            token: 'BEARER ' + token,
          });
        } else {
          res.status(401).json({
            code: 401,
            msg: 'Authentication failed. Wrong password.'
          });
        }
      });
    }
});

export default router;