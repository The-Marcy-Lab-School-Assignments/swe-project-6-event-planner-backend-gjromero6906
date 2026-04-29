require('dotenv').config()
const { Pool } = require('pg');

const config = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
};

const prodConfig = {
  connectionString: process.env.PG_CONNECTION_STRING,
}

const pool = new Pool(prodConfig);

module.exports = pool;