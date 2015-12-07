var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
  knex('movies').then(function (movies) {
    res.json(movies)
  }).catch(function (err) {
    next(new Error(err));
  })
});

module.exports = router;
