const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();

const { PORT,DB } = process.env;

const pool = new Pool({
    connectionString: DB,
    ssl: {
      require: true,
    },
});

module.exports = { PORT, pool };
