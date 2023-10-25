import mysql from "mysql2";

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASSWORD,
  database: "information_schema",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

export default mysqlConnection;
