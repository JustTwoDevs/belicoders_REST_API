import mysql from "mysql2";
import db from "./sqlDatabase.js";


export const listDatabases = (req, res) => {
  console.log("listDatabases");
  const query = "SHOW DATABASES";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching databases:", err);
      res.status(500).json({ error: "Error fetching databases" });
      return;
    }
    const databases = results.map((row) => row.Database);
    res.json({ databases });
  });
};

export const createDatabases = (req, res) => {
  const { script, databaseName } = req.body;

  const scriptDb = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: databaseName,
  });
  const createDatabaseQuery = `CREATE DATABASE ${databaseName}`;
    
  db.query(createDatabaseQuery, (err) => {
    if (err) {
      res.status(500).json({ error: 'Error creating the database', err });
      return;
    }

  });
 
  scriptDb.query(`USE ${databaseName}`, (useErr) => {
    if (useErr) {
      console.error("Error changing to the database", useErr);
      res
        .status(500)
        .json({ error: "Error changing to the database", err: useErr });
      return;
    }

    scriptDb.query(script, (scriptErr) => {
      if (scriptErr) {
        console.error("There is an error in your script:", scriptErr);
        res
          .status(500)
          .json({ error: "There is an error in your script", err: scriptErr });
        return;
      }

      scriptDb.end();

      res.json({
        message: "Database created successfully",
      });
    });
  });
};
