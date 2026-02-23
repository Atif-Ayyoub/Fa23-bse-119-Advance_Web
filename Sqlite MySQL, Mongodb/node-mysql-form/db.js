require('dotenv').config();
const mysql = require('mysql2');

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASS = '',
  DB_NAME = 'nodeform'
} = process.env;

let db = mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME });

function ensureDatabaseAndTable() {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (!err) {
        // ensure table exists with required columns
        const createTable = `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          email VARCHAR(150),
          phone VARCHAR(30),
          dob DATE,
          gender VARCHAR(20),
          address VARCHAR(255),
          username VARCHAR(100),
          password VARCHAR(255)
        )`;
        db.query(createTable, (tErr) => {
          if (tErr) return reject(tErr);
          console.log(`MySQL connected and table ready (${DB_NAME}.users)`);
          return resolve();
        });
        return;
      }

      // if database doesn't exist, create it then reconnect
      if (err && (err.code === 'ER_BAD_DB_ERROR' || err.errno === 1049 || /Unknown database/i.test(err.message))) {
        console.log(`Database '${DB_NAME}' not found — creating it...`);
        const tmp = mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS });
        tmp.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``, (createErr) => {
          tmp.end();
          if (createErr) return reject(createErr);
          // recreate connection with the database
          db = mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME });
          db.connect((err2) => {
            if (err2) return reject(err2);
            const createTable = `CREATE TABLE IF NOT EXISTS users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              first_name VARCHAR(100),
              last_name VARCHAR(100),
              email VARCHAR(150),
              phone VARCHAR(30),
              dob DATE,
              gender VARCHAR(20),
              address VARCHAR(255),
              username VARCHAR(100),
              password VARCHAR(255)
            )`;
            db.query(createTable, (tErr) => {
              if (tErr) return reject(tErr);
              console.log(`MySQL Connected; database '${DB_NAME}' and table 'users' ready`);
              return resolve();
            });
          });
        });
      } else {
        return reject(err);
      }
    });
  });
}

module.exports = { getDB: () => db, ensureDatabaseAndTable };
