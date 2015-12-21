var expect = require('chai').expect;
var app = require('../app')
var request = require('supertest')(app);
var knex = require('../db/knex');

describe("GET to /movies", function () {

    beforeEach(function () {
        return knex('movies').del()
            .then( function () {
                return knex('movies').insert({
                    title: 'Good Will Hunting',
                    release_year: 1997
                })
        })
    });

    it("returns a 200 status code and movie data", function (done) {
        request.get('/api/v1/movies')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.length).to.eq(1);
                done();
            })
    });

    it("can create a movie", function (done) {
        request.post('/api/v1/movies').send({
            title: 'The Last Samurai',
            release_year: 2003
        })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body[0].title).to.eq('The Last Samurai');
                expect(res.body[0].release_year).to.eq(2003);
                done();
            })
    })
});

