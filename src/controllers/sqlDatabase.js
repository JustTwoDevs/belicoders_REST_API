import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASSWORD,
  database: 'information_schema',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

export default db;