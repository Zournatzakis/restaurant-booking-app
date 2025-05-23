const mariadb = require("mariadb");
require("dotenv").config();

// Pool συνδέσεων προς τη MariaDB.
const pool = mariadb.createPool({
  host: process.env.database_host,
  user: process.env.database_user,
  password: process.env.database_password,
  database: process.env.database,
  connectionLimit: 5,
});

// Εξαγωγή pool για χρήση σε άλλα μέρη της εφαρμογής.
module.exports = pool;
