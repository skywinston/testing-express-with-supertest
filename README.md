# Express w/ Knex

## Setup

```
npm install
npm install -g knex
createdb movie-actors-development
knex migrate:latest
knex seed:run movies
nodemon
```

When you open the app, you should see JSON.  You could test this manually, but for this exercise you'll set it up to test with `supertest`.

## Setting Up Tests


**Install and configure mocha**

First you need to install your testing libraries:

```
npm install --save-dev mocha chai supertest
```

Notice that you use `--save-dev` - these packages do not need to be installed on your deployed servers.

Next you should create a test directory with your first test:

```
mkdir test
touch test/movies.test.js
```

Write a simple test and make sure it works:

```js
// in test/movies.test.js
var expect = require('chai').expect;

describe("something", function () {
  it("works", function () {
    expect(true).to.eq(true)
  })
})
```

Run your tests with `mocha` at the command line.

**Write a test that hits express**

Now that you have the basic setup happening, it's time to write a test against your app.  You'll do this with [Supertest](https://github.com/visionmedia/supertest).  Here's a snippet to get you started:

```js
// in test/movies.test.js
var expect = require('chai').expect;
var app = require('../app')
var request = require('supertest')(app);

describe("something", function () {
  it("works", function (done) {
    request.get('/api/v1/movies')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.body.length).to.eq(0)
        done();
      })
  })
})
```

Run this test with `mocha` - you should see it _fail_.  Why?  Because you are running the app against your development database, which already has seed data.  Let's fix that.

**Setup the test database**

When you write these integration-level tests for a data-driven application, you'll need to have a separate database to test against.  So create that:

```
createdb movie-actors-test
```

In order for your tests to run against the test database, you need to setup the connection string somewhere, and then connect to the correct database.  Create a new configuration block for your `movie-actors-test` database in `knexfile.js` (you can figure that one out yourself :)

Then run the tests with:

```
NODE_ENV=test mocha
```

You should see:

```
Error: expected 200 "OK", got 500 "Internal Server Error"
```

Why?  Throw a `console.log` in there to find out:

```js
// in test/movies.test.js
var expect = require('chai').expect;
var app = require('../app')
var request = require('supertest')(app);

describe("something", function () {
  it("works", function (done) {
    request.get('/api/v1/movies')
      .expect(200)
      .end(function (err, res) {
        console.log(res); // <------ add this line
        if (err) return done(err)
        expect(res.body.length).to.eq(0)
        done();
      })
  })
})
```

Do you see the error?  It's because the `movies` table doesn't exist.  So you'll have to run migrations against that test database.

```
knex migrate:latest --env test
```

Re-run tests with `NODE_ENV=test mocha`

**Setup package.json script**

Each language/framework has their own conventions for running tests.  In Node it's `npm test`:

```json
  "scripts": {
    "start": "node ./bin/www",
    "test": "NODE_ENV=test mocha"
  }
```

Now you can just run `npm test`.

## Test-Drive Some Code!!

### Show Appearances with Actor and Movie Data

Using a TDD approach (writing tests first), update the appearances endpoint `/api/v1/appearances` to return the following by joining `appearances` to `movies` and `actors`.

```json
[
  {
    "title": "Bourne Identity",
    "release_year": 2002,
    "name": "Matt Damon",
    "dob": "1970-10-08T06:00:00.000Z",
    "character": "Jason Bourne"
  },
  {
    "title": "Good Will Hunting",
    "release_year": 1997,
    "name": "Matt Damon",
    "dob": "1970-10-08T06:00:00.000Z",
    "character": "Will Hunting"
  },
  {
    "title": "Shawshank Redemption",
    "release_year": 1994,
    "name": "Morgan Freeman",
    "dob": "1937-06-01T06:00:00.000Z",
    "character": "Red"
  },
  {
    "title": "Shawshank Redemption",
    "release_year": 1994,
    "name": "Tim Robbins",
    "dob": "1958-10-16T06:00:00.000Z",
    "character": "Andy Dufrane"
  }
]
```

Note, you will have to use the `select` clause to limit the columns returned.

**Testing Notes**

For this test you can use strict equality inside the `res.end` function, like so:

```js
  .end(function (err, res) {
    expect(res.body).to.eql({
      // ... your full response here
    })
    done();
  })
```

This will require you to add setup data in a `beforeEach` block, and delete that data in an `afterEach` block.

You can do so by using regular database calls in your before/after functions.

### Add Create to Movies

URL: `POST /api/v1/movies`

When a movie is created, return a response like this:

```json
[
  {
    "id": 54,
    "title": "Some new movie name",
    "release_year": 1999
  }
]
```

NOTE: in order to do this, you'll need to either:

- use `returning('id')` (which returns an array of ids that were inserted, so you'll have to just grab the first one)
- use `returning('*')` to return the entire record

**Testing Notes**

You'll have to send JSON data from Supertest, like so:

```js
request
  .post("/api/v1/movies")
  .send({some: "data"})
  .expect(200)
  .expect(function(req){
    // write some assertions
    done()
  });
```

### Add Update to Movies

URL: `PATCH /api/v1/movies/1`

When a movie is updated, return a response like this:

```json
[
  {
    "id": 54,
    "title": "Some new movie name",
    "release_year": 1999
  }
]
```

**Testing Notes**

Often times asserting on the correct response is enough, but if you wanted to verify that it was updated, how would you do it?

One technique is to find the record again after the test has run and verify that the fields have been updated.

### Add Delete to Movies

URL: `DELETE /api/v1/movies/1`

When a movie is deleted, just return a HEAD response with a status code of 200.

**Testing Notes**

How will you test that the movie was in fact deleted?

One technique is to try to find that movie by its ID after running the test.

### Add a Column

Add a column to movies called `rating`.  Test-drive this change by first altering the tests for creating a movie, then test-drive the changes to `GET /api/v1/movies` as well.

**Testing Notes**

You will have to:

- write a migration
- run the migration on your test database
- make the tests pass
- run the migration on your dev database
- change more than one test to accommodate

---------

## Notes on creating migrations

```
knex migrate:make create_movies
```

In the `migrations` directory there is now a single file.  Change it to:

```js
exports.up = function(knex, Promise) {
  return knex.schema.createTable('movies', function (table) {
    table.increments();
    table.string('title').notNullable().unique();
    table.integer('release_year').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('movies');
};
```
