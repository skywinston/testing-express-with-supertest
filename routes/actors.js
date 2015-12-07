var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
  knex('actors').then(function (actors) {
    res.json(actors)
  }).catch(function (err) {
    next(new Error(err));
  })
});

module.exports = router;
