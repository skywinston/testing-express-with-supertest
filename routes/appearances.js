var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
  knex('appearances').then(function (appearances) {
    res.json(appearances)
  }).catch(function (err) {
    next(new Error(err));
  })
});

module.exports = router;
