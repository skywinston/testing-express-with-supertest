# Express w/ Knex

## Setup

```
npm install
createdb movie-actors
knex migrate:latest
knex seed:run movies
```

## Installing Knex

Taken largely from the docs at http://knexjs.org/

```
createdb movie-actors
npm install --save pg knex
npm install knex -g
knex init
```

Updated `knexfile.js` with the following:

```js
module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/movie-actors'
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }

};
```

On the command line:

```
knex migrate:make create_users
```

In the `migrations` directory there is now a single file.  Change it to:

```js
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('email').notNullable().unique();
    table.string('password_digest').notNullable();
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
```

Then run it with:

```
knex migrate:latest
```

## Using in Node / Express

Create a file such as `db/knex.js` with the following:

```js
var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile.js')[environment];
module.exports = require('knex')(config);
```

Then to use it, write this:

```js
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
  knex.select().table('users').then(function (users) {
    res.render('users/index', {users: users});
  })
})
```

The rest of the knex methods from the docs should make sense now that you have this basic setup.

## Seeds

Create a seed file with `knex seed:make somename`.

Then fill in the auto-generated file with the data you'd like to insert.
