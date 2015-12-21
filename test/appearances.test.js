var expect = require('chai').expect;
var app = require('../app');
var request = require('supertest')(app);
var knex = require('../db/knex');

describe("something", function () {

    beforeEach(function () {
        return knex('appearances').del()
            .then(function () {
                return knex('actors').del()
            })
            .then(function () {
                return knex('movies').del()
            })
            .then(function () {
                return knex('movies').insert({
                    title: 'Shawshank Redemption', release_year: 1994
                }).returning('id')
            })
            .then(function (movieId) {
                return knex('actors').insert({
                    name: 'Tim Robbins',
                    dob: '1958-10-16'
                }).returning('id').then(function (actorId) {
                    return {actorId: actorId[0], movieId: movieId[0]}
                })
            })
            .then(function (ids) {
                return knex('appearances').insert({
                    actor_id: ids.actorId,
                    movie_id: ids.movieId,
                    character: 'Andy Dufrane'
                })
            })
    })

    it("includes movie data and actor data in the response", function (done) {
        request.get('/api/v1/appearances')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                expect(res.body.length).to.eq(1);
                expect(res.body[0].title).to.eq("Shawshank Redemption");
                expect(res.body[0].name).to.eq("Tim Robbins");
                expect(res.body[0].character).to.eq("Andy Dufrane");

                done();
            })
    })
});
