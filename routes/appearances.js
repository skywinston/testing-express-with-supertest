var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
    knex.from('appearances')
        .column(['title', 'release_year', 'name', 'dob', 'character'])
        .innerJoin('movies', 'movies.id', 'movie_id')
        .innerJoin('actors', 'actors.id', 'actor_id')
        .then( function (result) {
            res.send(result);
        })
});

module.exports = router;
