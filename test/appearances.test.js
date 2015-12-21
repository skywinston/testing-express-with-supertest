var expect = require('chai').expect;
var app = require('../app')
var request = require('supertest')(app);

//describe('appearances api endpoint', function () {
//    it('joins appearances to movies and actors', function (){
//        request.get('/api/v1/appearances')
//            .expect(200)
//            .end( function (err, res) {
//                if (err) return done(err);
//                // todo — write test
//            })
//    })
//});