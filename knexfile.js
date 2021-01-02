const Dotenv = require('dotenv')
Dotenv.config({ path: `${__dirname}/.env` })
const { Db_NAME, DB_USER, DB_PASS} = process.env
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '/migrations',
    }
  },

  production: {
    client: 'mysql',

    connection:{

    
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: '/migrations',
    }
  }
}

};