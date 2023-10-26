import mysql from "mysql2";
import db from "#databaseConnections/mysqlConnection.js";

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

export const createDatabases = async (req, res) => {
  const { script, databaseName } = req.body;

  const scriptDb = mysql.createConnection ({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: databaseName,
  });

    const createDatabaseSQL = 'CREATE DATABASE ??';
    await scriptDb.execute(createDatabaseSQL, [databaseName]);
    

  scriptDb.query(createDatabaseSQL, (err) => {
    if (err) {
      res.status(500).json({ error: "Error creating the database", err });
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

export const deleteDatabases = (req, res) => {
  const { databaseName } = req.body;
  const query = "DROP DATABASE ??";
  db.query(query, [databaseName], (err) => {
    if (err) {
      console.error("Error deleting the database:", err);
      res.status(500).json({ error: "Error deleting the database" });
      return;
    }
    res.json({
      message: "Database deleted successfully",
    });
  });
}