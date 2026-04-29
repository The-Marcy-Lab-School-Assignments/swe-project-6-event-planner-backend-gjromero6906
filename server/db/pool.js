
const { Pool } = require('pg');

const config = {
  host: 'localhost',
  port: 5432,
  database: 'event_planner_db',
  user: 'postgres',
  password: 'marcy',
};


const pool = new Pool(config);

module.exports = pool;