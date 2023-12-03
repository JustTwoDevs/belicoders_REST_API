import mysql from "mysql2";

const mysqlConnection = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASSWORD,
  database: "information_schema",
  multipleStatements: true,
});

export const  executeQuery= (options)=> {
  return new Promise((resolve, reject) => {
    const { query, useExecute, validation } = options;
    if (validation) {
      // validate query
      if (isUnsafeQuery(query)) {
        const error = new Error("You can just execute SELECT queries");
        reject(error);
        return;
      }
    }

    mysqlConnection.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("Connected to the mysql database :)!");
     
      

      if (useExecute) {
        connection.execute(query, (queryErr, results) => {
          connection.release();

          if (queryErr) {
            reject(queryErr);
          } else {
            resolve(results);
          }
        });
      } else {
        connection.query(query, (queryErr, results, fields) => {
          connection.release();

          if (queryErr) {
            reject(queryErr);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
}

function isUnsafeQuery(query) {

  const unsafeKeywords = ["INSERT", "DELETE", "CREATE", "DROP", "ALTER"];
  const normalizedQuery = query.toUpperCase();
  return unsafeKeywords.some(keyword => normalizedQuery.includes(keyword));
}


export default mysqlConnection;
