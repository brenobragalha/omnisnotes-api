const setupKnex = require('knex');

const config = {
  client: 'sqlite3',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: false,
  migrations: {
    directory: './db/migrations',
  },
};

const knex = setupKnex(config);

module.exports = { config, knex };
