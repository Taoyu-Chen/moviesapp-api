"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _tmdbApi = require("../tmdb-api");

var _movieModel = _interopRequireDefault(require("./movieModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/', function (req, res, next) {
  _movieModel["default"].find().then(function (movies) {
    res.status(200).send(movies);
  })["catch"](function (err) {
    return next(err);
  });
});
router.get('/db/:id', function (req, res, next) {
  var id = parseInt(req.params.id);
  (0, _tmdbApi.getSimilarMovies)(id).then(function _callee(movies) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.status(200).send(movies);
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(_movieModel["default"].deleteMany({}));

          case 4:
            _context.next = 6;
            return regeneratorRuntime.awrap(_movieModel["default"].collection.insertMany(movies));

          case 6:
            console.info("".concat(movies.length, " movies were successfully stored."));
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](1);
            console.error("failed to insert movies Data: ".concat(_context.t0));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 9]]);
  })["catch"](function (err) {
    return next(err);
  });
});
router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id);

  _movieModel["default"].findByMovieDBId(id).then(function (movie) {
    if (movie) {
      return res.status(200).send(movie);
    } else {
      return res.status(404).send({
        message: "Failed to find movie with id: ".concat(id, "."),
        status: 404
      });
    }
  })["catch"](function (err) {
    return next(err);
  });
});
router.get('/:id/reviews', function (req, res, next) {
  var id = parseInt(req.params.id);
  (0, _tmdbApi.getMovieReviews)(id).then(function (reviews) {
    return res.status(200).send(reviews);
  })["catch"](function (err) {
    return next(err);
  });
}); // Update a movie

router.put('/:id', function (req, res) {
  var key = parseInt(req.params.id);
  var updateMovie = req.body;

  var index = _movieModel["default"].movies.map(function (movie) {
    return movie.id;
  }).indexOf(key);

  if (index !== -1) {
    !updateMovie.id ? updateMovie.id = key : updateMovie;
    moviesObject.movies.splice(index, 1, updateMovie);
    res.status(200).send(updateMovie);
  } else {
    res.status(404).send({
      message: 'Unable to find Movie',
      status: 404
    });
  }
});
router.put('/:id', function _callee2(req, res) {
  var product;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_movieModel["default"].findById(req.params.id));

        case 2:
          product = _context2.sent;
          product.title = req.body.title; // 保存产品

          _context2.next = 6;
          return regeneratorRuntime.awrap(product.save());

        case 6:
          res.send(product);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Delete a movie

router["delete"]('/:id', function (req, res, next) {
  _movieModel["default"].findOneAndDelete({
    id: req.params.id
  }).then(function (result) {
    if (result) {
      return res.status(200).send({
        message: "Successfully deleted movie with id: ".concat(req.params.id, "."),
        status: 200
      });
    } else {
      return res.status(404).send({
        message: "The deleted movie does not exist, the request id: ".concat(req.params.id, "."),
        status: 404
      });
    }
  })["catch"](function (err) {
    return next(err);
  });
});
var _default = router;
exports["default"] = _default;