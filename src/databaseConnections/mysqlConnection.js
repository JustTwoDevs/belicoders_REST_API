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
    mysqlConnection.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      const { query, useExecute } = options;

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


export default mysqlConnection;
